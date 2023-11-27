<?php
session_start();
include("../Connection.php");
include("../Function.php");
$user_data = check_login($link);
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    Home
  </title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="../UI-bars/sidebar_style.css?v=1.1">
</head>

<body>
  <div class="topnav">
    <div class="topnav-right">
      Hello,
      <?php echo $user_data['username'] ?>
      <a href="../logout.php">
        logout
      </a>
    </div>
  </div>
  <div class="sidebar">
    <ul>
      <li>
        <a href="#" class="active">
          <img src='../UI-bars/images/home.png'>
        </a>
        <span class="tooltiptext">
          Home
        </span>
      </li>
      <li>
        <a href="../Post_UI/RecordedPage/Recorded.html">
          <img src='../UI-bars/images/downloads.png'>
        </a>
        <span class="tooltiptext">
          Recorded
        </span>
      </li>
      <li>
        <a href="../Post_UI/PostPage/post.html">
          <img src='../UI-bars/images/post.ico'>
        </a>
        <span class="tooltiptext">
          Post
        </span>
      </li>
      <li>
        <a href="#" id="myBtn" class="addgroup">
          <img src='../UI-bars/images/addgroup.png'>
        </a>
        <span class="tooltiptext">
          Add Group
        </span>
      </li>
      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close">
            &times;
          </span>
          <div class="addgroup">
            <h3>
              Find your group here
            </h3>
            <input type="text" id="searchInput" maxlength="5" placeholder="Enter a 5-character code"
              oninput="this.value = this.value.toUpperCase()">
            <button onclick="searchGroup()">
              Search
            </button>
            <p id="resultContainer">
            </p>
          </div>
        </div>
      </div>
      <div class="bot-set">
        <li>
          <a href='#'>
            <img src='../UI-bars/images/settings-3-64.png'>
            <span class="tooltiptext">
              Setting
            </span>
          </a>
        </li>
      </div>
    </ul>
  </div>
  <div class="content">
    <div class="main-content">
      <div class="first-row">
        <div class="card">
          <div class="photo">
            <img src="./imgs/1.png" alt="" class="img1">
          </div>
          <h3>Group1</h3>
          <h4>Information:</h4>
          <p>Creation time: xxxx/xx/xx
            <br>
            Admin: XXX
            <br>
            Number of people: 50
            <br>
          </p>
          <a href="#">Check members</a>
        </div>
        <div class="card">
          <div class="photo">
            <img src="./imgs/2.png" alt="" class="img1">
          </div>
          <h3>Group2</h3>
          <h4>Information:</h4>
          <p>Creation time: xxxx/xx/xx
            <br>
            Admin: XXX
            <br>
            Number of people: 50
            <br>
          </p>
          <a href="#">Check members</a>
        </div>
      </div>
      <div class="second-row">
        <div class="card">
          <div class="photo">
            <img src="./imgs/3.png" alt="" class="img1">
          </div>
          <h3>Group3</h3>
          <h4>Information:</h4>
          <p>Creation time: xxxx/xx/xx
            <br>
            Admin: XXX
            <br>
            Number of people: 50
            <br>
          </p>
          <a href="#">Check members</a>
        </div>
        <div class="card">
          <div class="photo">
            <img src="./imgs/4.png" alt="" class="img1">
          </div>
          <h3>Group4</h3>
          <h4>Information:</h4>
          <p>Creation time: xxxx/xx/xx
            <br>
            Admin: XXX
            <br>
            Number of people: 50
            <br>
          </p>
          <a href="#">Check members</a>
        </div>
      </div>
    </div>
  </div>
  </div>
  <script src="../UI-bars/sidebar.js"></script>
</body>

</html>