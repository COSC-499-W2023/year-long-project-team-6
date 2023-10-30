<?php
$dbhost = "cs499-webrtc.caxoba5cryiy.ca-central-1.rds.amazonaws.com";
$dbuser = "admin";
$dbpass = "cosc499webrtc";
$dbname = "workplace";
$link = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$link) {
    die("Connection failed: " . mysqli_connect_error());
}