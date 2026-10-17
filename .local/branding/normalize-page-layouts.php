<?php
define('CLI_SCRIPT', true);
require(__DIR__ . '/../../config.php');
$fs = get_file_storage();
$context = context_system::instance();
$backup = __DIR__ . '/before-page-layout-normalization';
if (!is_dir($backup)) { mkdir($backup, 0777, true); }
function layout_param(&$params, $name, $value) {
    foreach ($params as &$param) {
        if ($param['name'] === $name) { $param['value'] = $value; return; }
    }
    $params[] = ['name'=>$name,'value'=>$value];
}
$spacing = [];
foreach (['global','larger_desktop','large_desktop','desktop','tablet','landscape_mobile','mobile'] as $device) {
    $small = in_array($device, ['landscape_mobile','mobile']);
    $spacing[$device] = ['top'=>$small?'24':'32','right'=>'0','bottom'=>$small?'32':'48','left'=>'0','lock'=>false,'unit'=>'px'];
}
foreach (['standard','frontpage','admin'] as $name) {
    $file = $fs->get_file($context->id, 'theme_moon', 'main_layouts', 0, '/', $name.'.json');
    if (!$file) { throw new RuntimeException('Missing layout '.$name); }
    if (!file_exists($backup.'/'.$name.'.json')) { file_put_contents($backup.'/'.$name.'.json', $file->get_content()); }
    $layout = json_decode($file->get_content(), true, 512, JSON_THROW_ON_ERROR);
    if ($name === 'frontpage') {
        $layout['layout'] = 'frontpage';
        $layout['title'] = 'Beranda PADI';
    } else {
        if ($name === 'standard') {
            $layout['title'] = 'Halaman Standar PADI';
            $layout['layout'] = 'standard';
            $layout['data']['sections'] = array_values(array_filter($layout['data']['sections'], function($section) {
                foreach ($section['params'] as $param) {
                    if ($param['name'] === 'title' && in_array($param['value'], ['Pembuka PADI','Akses cepat','Pengantar katalog','Panduan belajar'])) { return false; }
                }
                return true;
            }));
        }
        foreach ($layout['data']['sections'] as &$section) {
            foreach ($section['rows'] as &$row) {
                foreach ($row['cols'] as &$column) {
                    foreach ($column['elements'] as &$element) {
                        if ($element['type'] !== 'main_content') { continue; }
                        layout_param($element['params'], 'padding', json_encode($spacing));
                        layout_param($element['params'], 'customclass', 'padi-app-content');
                        layout_param($element['params'], 'title', 'Konten halaman Moodle');
                    }
                    unset($element);
                }
                unset($column);
            }
            unset($row);
        }
        unset($section);
    }
    $content = json_encode($layout, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    \local_moon\library\helper\media::create_from_string($content, $name.'.json', '/', 'main_layouts', 0, 'theme_moon');
    file_put_contents(__DIR__.'/'.$name.'.json', $content);
    echo $name.': '.$layout['title'].' ('.count($layout['data']['sections']).' sections)'.PHP_EOL;
}
theme_reset_all_caches();
