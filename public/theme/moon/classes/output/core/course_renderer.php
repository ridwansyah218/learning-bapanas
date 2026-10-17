<?php
// This file is part of Moodle - https://moodle.org/
// Moodle is distributed under the GNU GPL v3 or later.

namespace theme_moon\output\core;

defined('MOODLE_INTERNAL') || die();

/** Course catalogue presentation for PADI. */
class course_renderer extends \core_course_renderer {
    /** Keep native search and category controls together on the site home. */
    public function course_search_form($value = '') {
        $search = parent::course_search_form($value);
        if ($this->page->pagetype !== 'site-index' || $value !== '') {
            return $search;
        }
        return $this->catalogue_filters($search);
    }

    /**
     * Top-level catalogue (course/index.php without a category): list every course as cards
     * instead of the category tree. Category pages keep the native behaviour.
     */
    public function course_category($category) {
        global $CFG;
        if (!empty($category) || \core_course_category::is_simple_site()) {
            return parent::course_category($category);
        }
        $this->page->set_title(get_string('fulllistofcourses'));

        $perpage = optional_param('perpage', $CFG->coursesperpage, PARAM_INT);
        $page = optional_param('page', 0, PARAM_INT);
        $baseurl = new \moodle_url('/course/index.php');
        if ($perpage != $CFG->coursesperpage) {
            $baseurl->param('perpage', $perpage);
        }

        $chelper = new \coursecat_helper();
        $chelper->set_show_courses(self::COURSECAT_SHOW_COURSES_EXPANDED)
            ->set_courses_display_options([
                'recursive' => true,
                'limit' => $perpage,
                'offset' => $page * $perpage,
                'paginationurl' => $baseurl,
            ])
            ->set_attributes(['class' => 'category-browse category-browse-all']);

        $top = \core_course_category::top();
        $courses = $top->get_courses($chelper->get_courses_display_options());
        $totalcount = $top->get_courses_count($chelper->get_courses_display_options());

        $output = $this->catalogue_filters(parent::course_search_form());
        if (!$totalcount) {
            return $output . $this->notification(get_string('nocourses'), 'info');
        }
        return $output . $this->coursecat_courses($chelper, $courses, $totalcount);
    }

    /** Category jump menu (with a neutral placeholder) next to the native course search. */
    protected function catalogue_filters(string $search): string {
        $options = [];
        foreach (\core_course_category::make_categories_list() as $id => $name) {
            $url = new \moodle_url('/course/index.php', ['categoryid' => $id]);
            $options[$url->out(false)] = $name;
        }
        $category = '';
        if ($options) {
            $select = new \url_select($options, '', ['' => get_string('categories')]);
            $select->set_label(get_string('categories'), ['class' => 'visually-hidden']);
            $select->class .= ' text-truncate w-100';
            $category = \html_writer::div($this->output->render($select), 'navitem');
        }
        return \html_writer::div(
            \html_writer::div($category . \html_writer::div($search, 'navitem'), 'd-flex'),
            'container-fluid tertiary-navigation padi-course-filters'
        );
    }
}
