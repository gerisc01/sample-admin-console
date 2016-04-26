<?php
$file_name = "users.json";

$new_user = $_POST["new_user"]; // boolean
$username = $_POST["username"]; // string
$password = $_POST["password"]; // string
$email = $_POST["email"]; // string
$age = (int)$_POST["age"]; // int
$name = $_POST["name"]; // name

$user_obj = array("username" => $username, "password" => $password, "age" => $age, "name" => $name, "email" => $email);

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

// Check to see if the user already exists, and if so load the index into $user_index
foreach($users as $index => $user) {
    if ($user["username"] == $username) {
        $user_index = $index;
    }
}

// After db error checking
$error = null;
if (strtolower($new_user) == "true") {
    if (!is_null($user_index)) { $error = "Failure: The username '".$username."' already exists."; }
    else if (is_null($password) || $password == "") { $error = "An empty password is not allowed."; }
} else {
    if (is_null($user_index)) { $error = "Failure: The username '".$username."' could not be found."; }
}
if (is_null($error) && $age < 1) { $error = "Failure: The age must be a positive integer greater than or equal to 1."; }

// If there was an error, close the file, error, and exit
if (!is_null($error)) {
    // fclose($myfile);
    exit($error."\r\n");
}

// Update $users with the inputted information
if (strtolower($new_user) == "true") {
    array_push($users,$user_obj);
} else {
    foreach ($user_obj as $key => $val) {
        if ($val != null) {
            $users[$user_index][$key] = $val;
        }
    }
    $user_obj = $users[$user_index];
}

$db_obj = array("users" => $users);
$db_str = json_encode($db_obj);

$myfile = fopen($file_name, "w") or die("Unable to open file!");
fwrite($myfile, $db_str);
fclose($myfile);

echo json_encode($user_obj);
?>