<?php
session_start();
$file_name = "users.json";

// $username = $_POST["username"]; // string
// $password = $_POST["password"]; // string

$username = "scott.gerike";
$password = "asdfasdf";

// If the username is blank or null, error and exit
if (is_null($username) || $username == "") { exit("Failure: A username is required.\r\n"); }

// If the username is not null, load up the "database" file
if (file_exists($file_name)) {
    $myfile = fopen($file_name, "r") or die("Unable to open users file!");
    $db_str = fread($myfile,filesize($file_name));
    fclose($myfile);
} else {
    $db_str = '{"users" : []}';
}

$users = json_decode($db_str,true)["users"];

// Check to see if the user and password match the database
foreach($users as $user) {
    if ($user["username"] == $username) {
        $found_user = $user;
    }
}

if (!is_null($found_user) && $password == $found_user["password"]) {
    $_SESSION["username"] = $username;
    header("Location: /index.html");
} else {
    header("Location: /login.html");
}
?>