<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
$destination = __DIR__;
$snapshot = ['theme' => get_config('theme_moon'), 'site' => ['theme' => $CFG->theme, 'additionalhtmlhead' => $CFG->additionalhtmlhead ?? '']];
file_put_contents($destination . '/settings-before.json', json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
$fs = get_file_storage();
$context = context_system::instance();
foreach ($fs->get_area_files($context->id, 'theme_moon', 'main_layouts', 0, '', false) as $file) {
    file_put_contents($destination . '/before-' . $file->get_filename(), $file->get_content());
}
echo "Settings and layouts exported.\n";
