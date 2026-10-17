<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
require_once($CFG->libdir . '/adminlib.php');
$settings = json_decode(file_get_contents(__DIR__ . '/settings-new.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($settings as $name => $value) {
    set_config($name, str_replace('@@ROOT@@', $CFG->wwwroot, $value), 'theme_moon');
}
foreach (['frontpage', 'standard', 'admin', 'coursecategory'] as $layout) {
    $content = str_replace('@@ROOT@@', $CFG->wwwroot, file_get_contents(__DIR__ . '/' . $layout . '.json'));
    \local_moon\library\helper\media::create_from_string($content, $layout . '.json', '/', 'main_layouts', 0, 'theme_moon');
}
$head = $CFG->additionalhtmlhead ?? '';
$head = preg_replace('~<!-- PADI Bapanas branding -->.*?<!-- /PADI Bapanas branding -->~s', '', $head);
$cssurl = $CFG->wwwroot . '/branding/bapanas/padi.css?v=' . filemtime($CFG->dirroot . '/branding/bapanas/padi.css');
$head .= "\n" . '<!-- PADI Bapanas branding --><link rel="stylesheet" href="' . s($cssurl) . '"><!-- /PADI Bapanas branding -->';
set_config('additionalhtmlhead', $head);
set_config('theme', 'moon');
theme_reset_all_caches();
echo "PADI corporate branding applied through Moodle and Moon settings.\n";
