<?php
// Adds Moon-native page structure (title, secondary navigation, activity/course
// header & footer elements) to the PADI standard and admin layouts, and builds
// the course catalogue layout (coursecategory). Safe to run repeatedly.
// Usage: C:\xampp\php\php.exe .local/branding/page-headers.php
define('CLI_SCRIPT', true);
require(__DIR__ . '/../../config.php');

$fs = get_file_storage();
$context = context_system::instance();
$backup = __DIR__ . '/before-page-headers';
if (!is_dir($backup)) { mkdir($backup, 0777, true); }

$p = fn($name, $value) => ['name' => $name, 'value' => $value];
$element = fn($id, $type, $title, array $extra = []) => [
    'id' => $id, 'type' => $type, 'state' => 1,
    'params' => array_merge([$p('title', $title), $p('customclass', '')], $extra),
];
$section = fn($id, $title, $class, array $elements) => [
    'id' => $id, 'type' => 'section', 'state' => 1,
    'params' => [$p('title', $title), $p('customclass', 'padi-shell ' . $class), $p('layout_type', 'container'), $p('moon_element_tag', 'div')],
    'rows' => [['id' => $id . 'r', 'type' => 'row', 'state' => 1, 'fill' => true,
        'cols' => [['id' => $id . 'c', 'type' => 'column', 'state' => 1,
            'size' => ['xxl' => 12, 'xl' => 12, 'lg' => 12, 'md' => 12, 'sm' => 12, 'xs' => 12],
            'params' => [], 'elements' => $elements]]]],
];
$pagehead = fn($prefix) => $section($prefix . 'head', 'Judul halaman', 'padi-page-head', [
    $element($prefix . 'headel', 'full_header', 'Judul & breadcrumb Moodle', [$p('only_admin', '0')]),
]);
$pagetabs = $section('padinavsec', 'Navigasi halaman', 'padi-page-tabs', [
    $element('padinavsecel', 'menu', 'Navigasi sekunder (tab kursus/profil)', [$p('menu_type', 'secondary')]),
]);

/** Remove sections added by an earlier run, then insert $new after the portal header section (padi5). */
function padi_insert_after_header(array $sections, array $new): array {
    $ids = array_column($new, 'id');
    $sections = array_values(array_filter($sections, fn($s) => !in_array($s['id'], $ids, true)));
    $out = [];
    foreach ($sections as $s) {
        $out[] = $s;
        if ($s['id'] === 'padi5') { array_push($out, ...$new); }
    }
    return $out;
}

/** Wrap the main_content element with Moon's course/activity header and footer elements. */
function padi_wrap_main(array $sections, callable $element): array {
    $wrapped = ['course_content_header', 'activity_header', 'activity_navigation', 'course_content_footer'];
    foreach ($sections as &$s) {
        foreach ($s['rows'] as &$row) {
            foreach ($row['cols'] as &$col) {
                $types = array_column($col['elements'], 'type');
                if (!in_array('main_content', $types, true)) { continue; }
                $els = array_values(array_filter($col['elements'], fn($e) => !in_array($e['type'], $wrapped, true)));
                $out = [];
                foreach ($els as $e) {
                    if ($e['type'] === 'main_content') {
                        $out[] = $element('padiccheader', 'course_content_header', 'Header konten kursus');
                        $out[] = $element('padiactheader', 'activity_header', 'Header aktivitas (penyelesaian, tanggal)');
                        $out[] = $e;
                        $out[] = $element('padiactnav', 'activity_navigation', 'Navigasi aktivitas sebelumnya/berikutnya');
                        $out[] = $element('padiccfooter', 'course_content_footer', 'Footer konten kursus');
                    } else {
                        $out[] = $e;
                    }
                }
                $col['elements'] = $out;
            }
        }
    }
    return $sections;
}

/** Footer tagline: plain <span>s are stripped by Moodle text filtering, so use block wrappers. */
function padi_fix_footer(array $sections): array {
    $bottom = '<div class="padi-footer-bottom"><div>PADI · Badan Pangan Nasional</div><div>Belajar. Berkembang. Berkontribusi.</div></div>';
    array_walk_recursive($sections, function(&$value) use ($bottom) {
        if (is_string($value) && str_contains($value, 'padi-footer-bottom')) {
            $value = preg_replace('~<div class="padi-footer-bottom">.*?</div>(?=\s*</div>\s*</div>\s*$)~s', $bottom, $value);
        }
    });
    return $sections;
}

$load = function($name) use ($fs, $context, $backup) {
    $file = $fs->get_file($context->id, 'theme_moon', 'main_layouts', 0, '/', $name . '.json');
    if (!$file) { throw new RuntimeException('Missing layout ' . $name); }
    if (!file_exists($backup . '/' . $name . '.json')) { file_put_contents($backup . '/' . $name . '.json', $file->get_content()); }
    return json_decode($file->get_content(), true, 512, JSON_THROW_ON_ERROR);
};
$save = function($name, array $layout) {
    $layout['data']['sections'] = padi_fix_footer($layout['data']['sections']);
    $json = json_encode($layout, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    \local_moon\library\helper\media::create_from_string($json, $name . '.json', '/', 'main_layouts', 0, 'theme_moon');
    file_put_contents(__DIR__ . '/' . $name . '.json', $json);
    echo $name . ': ' . $layout['title'] . ' (' . count($layout['data']['sections']) . " sections)\n";
};

// Standard: every page without its own layout (course, activity, dashboard, profile, calendar, grades...).
$standard = $load('standard');
// Plain frame (topbar, header, content, footer) without anything this script adds, for the catalogue.
$standardbase = $standard;
$standardbase['data']['sections'] = array_values(array_filter($standardbase['data']['sections'],
    fn($s) => !in_array($s['id'], ['padipagehead', 'padinavsec'], true)));
foreach ($standardbase['data']['sections'] as &$s) {
    foreach ($s['rows'] as &$row) {
        foreach ($row['cols'] as &$col) {
            $col['elements'] = array_values(array_filter($col['elements'], fn($e) => !in_array($e['type'],
                ['course_content_header', 'activity_header', 'activity_navigation', 'course_content_footer'], true)));
        }
    }
}
unset($s, $row, $col);
$standard['data']['sections'] = padi_insert_after_header($standard['data']['sections'], [$pagehead('padipage'), $pagetabs]);
$standard['data']['sections'] = padi_wrap_main($standard['data']['sections'], $element);
$save('standard', $standard);

// Admin: page title above the existing admin secondary navigation.
$admin = $load('admin');
$admin['data']['sections'] = padi_insert_after_header($admin['data']['sections'], [$pagehead('padiadmin')]);
$save('admin', $admin);

// Course catalogue (course/index.php): standard frame + page title, without course/activity elements.
$catalogue = $standardbase;
$catalogue['data']['sections'] = padi_insert_after_header($catalogue['data']['sections'], [$pagehead('padicat')]);
$catalogue['title'] = 'Katalog Kursus PADI';
$catalogue['desc'] = 'Daftar kursus dan kategori (course/index.php)';
$catalogue['layout'] = 'coursecategory';
$catalogue['name'] = 'coursecategory';
$old = $fs->get_file($context->id, 'theme_moon', 'main_layouts', 0, '/', 'coursecategory.json');
if ($old) {
    if (!file_exists($backup . '/coursecategory.json')) { file_put_contents($backup . '/coursecategory.json', $old->get_content()); }
    $old->delete();
}
$save('coursecategory', $catalogue);

// Frontpage: footer only.
$save('frontpage', $load('frontpage'));

theme_reset_all_caches();
