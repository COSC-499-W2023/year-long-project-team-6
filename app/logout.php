<?php
session_start();

if (isset($_SESSION['userid'])) {
    unset($_SESSION['userid']);
}
header("Location: login_signup/LS.php");
die;