<?php
define('CLI_SCRIPT', true);
require(dirname(__DIR__, 2) . '/config.php');
require_once($CFG->libdir . '/adminlib.php');
$context = context_system::instance();
$fs = get_file_storage();
$old = $fs->get_file($context->id, 'theme_moon', 'main_layouts', 0, '/', 'admin.json');
if ($old && !file_exists(__DIR__ . '/before-admin.json')) {
    file_put_contents(__DIR__ . '/before-admin.json', $old->get_content());
}
$content = str_replace('@@ROOT@@', $CFG->wwwroot, file_get_contents(__DIR__ . '/admin.json'));
\local_moon\library\helper\media::create_from_string($content, 'admin.json', '/', 'main_layouts', 0, 'theme_moon');
theme_reset_all_caches();
echo "Native Moon admin layout updated.\n";
