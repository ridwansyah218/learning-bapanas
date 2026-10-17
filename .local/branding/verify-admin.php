<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
$PAGE->set_context(context_system::instance());
$PAGE->set_url('/admin/search.php');
$PAGE->set_pagelayout('admin');
$PAGE->force_theme('moon');
$layout = \local_moon\library\element\layout::get_data_layout('admin', 'main_layouts');
$json = json_encode($layout);
$types = [];
foreach ($layout['data']['sections'] as $section) {
    foreach ($section['rows'] as $row) {
        foreach ($row['cols'] as $column) {
            foreach ($column['elements'] as $element) {
                $types[] = $element['type'];
            }
        }
    }
}
if (str_contains($json, 'templaza') || str_contains($json, 'topbar6a7') || !in_array('menu', $types) || !in_array('main_content', $types)) {
    throw new RuntimeException('Admin layout verification failed.');
}
echo 'Effective admin layout: ' . $layout['title'] . "\n";
echo 'Native elements: ' . implode(', ', $types) . "\n";
echo "No demo contact/footer references.\n";
