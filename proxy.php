<?php
// simple proxy; please do not use in a production environment

// get the URL
$url = $_POST["url"];

// fetch the page
$page = file_get_contents($url);

// return the page
echo $page;

?>