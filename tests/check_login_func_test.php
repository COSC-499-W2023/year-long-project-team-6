<?php

session_start();
require '../app/Connection.php';
require '../app/Function.php';

function testCheckLogin($link)
{
    $query = "SELECT * FROM users WHERE userid = 1";
    $result = mysqli_query($link, $query);
    if ($result && mysqli_num_rows($result) > 0) {
        $query = "DELETE FROM users WHERE userid = 1";
        mysqli_query($link, $query);
    }
    $query = "INSERT INTO users (userid, username) VALUES (1, 'testuser')";
    mysqli_query($link, $query);
    $_SESSION['userid'] = 1;
    $user_data = check_login($link);
    if ($user_data['userid'] == 1 && $user_data['username'] == 'testuser') {
        echo "testCheckLogin passed\n";
    } else {
        echo "testCheckLogin failed\n";
    }
    $query = "DELETE FROM users WHERE userid = 1";
    mysqli_query($link, $query);
    unset($_SESSION['userid']);
}

function testRandomNum()
{
    $num1 = random_num(4);
    $num2 = random_num(5);
    $num3 = random_num(10);
    if ($num1 != $num2 && $num1 != $num3 && $num2 != $num3) {
        echo "testRandomNum passed\n";
    } else {
        echo "testRandomNum failed\n";
    }
}

testCheckLogin($link);
testRandomNum();
