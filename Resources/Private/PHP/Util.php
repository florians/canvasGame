<?php

function combine_my_files($array_files, $destination_dir, $dest_file_name, $type, $debug)
{
    if (!is_file($destination_dir . $dest_file_name) || $debug == true) {
        $content = "";
        foreach ($array_files as $file) {
            $content .= file_get_contents($file);
        }
        if(!is_dir($destination_dir)){
            mkdir($destination_dir, 0755, true);
        }
        $new_file = fopen($destination_dir . $dest_file_name, "w");
        if ($type == 'js') {
            $content = '(function($) {' . $content . '})(jQuery)';
        }
        if ($type == 'css') {
            $content = str_replace('; ', ';', str_replace(' }', '}', str_replace('{ ', '{', str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), "", preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $content)))));
        }

        fwrite($new_file, $content);
        fclose($new_file);
        return return_type($type, $destination_dir, $dest_file_name);
    } else {
        return return_type($type, $destination_dir, $dest_file_name);
    }
}

function return_type($type, $destination_dir, $dest_file_name)
{
    if ($type == 'css') {
        return '<link rel="stylesheet" type="text/css" href="' . $destination_dir . $dest_file_name . '" />';
    }
    if ($type == 'js') {
        return '<script src="' . $destination_dir . $dest_file_name . '"></script>';
    }
}
