<?php

function check_login($link)
{
    if (isset($_SESSION['userid'])) {
        $id = $_SESSION['userid'];
        $query = "select * from users where userid = $id limit 1";

        $result = mysqli_query($link, $query);
        if ($result && mysqli_num_rows($result) > 0) {
            $user_data = mysqli_fetch_assoc($result);
            return $user_data;
        }
    }

    //redirect to login 
    header("Location: ../login_signup/LS.php");
    die;
}

function random_num($length)
{
    $text = "";
    if ($length < 5) {
        $length = 5;
    }

    $len = rand(4, $length);

<<<<<<< HEAD
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for ($i = 0; $i < $len; $i++) {
        $text .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $text;
}
=======
    for ($i = 0; $i < $len; $i++) {

    }
}
>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f