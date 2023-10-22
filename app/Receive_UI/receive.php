<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="receive.css">

</head>

<body>
    <div class="topnav">
        <a class="active" href="#home">Home</a>
        <a href="#">Feature</a>
        <a href="#">Friend</a>
        <a href="#">Notice</a>
        <div class="topnav-right">
            <a href="#">login</a>
        </div>
    </div>


    <div class="sidebar">
        <ul>
            <li><a href="#"><img src='images/downloads.png'></a><span class="tooltiptext">Recorded</span></li>
            <li><a href="#"><img src='images/inbox-64.png'></a><span class="tooltiptext">Inbox</span></li>
            <li><a href="#"><img src='images/likes-64.png'></a><span class="tooltiptext">Liked Videos</span></li>
            <div class="bot-set">
                <li><a href='#'><img src='images/settings-3-64.png'><span class="tooltiptext">Setting</span></a></li>
            </div>

        </ul>
    </div>
    
    <div id="container">
        <div class="group">
            <img src="/" alt="logo">
            <h3>Group name</h3>
        </div>
        <div class="video_container">
            <div class="contain_video_1">
                <div class="user_info">
                    <img src="./Image/2.jpg" alt="user_img">
                    <a class="video_name">Video Name</a>
                    <a class="date">2023/09/20</a>
                </div>
                <a class="video_description">Video description</a>

                <video id="myVideo_1" width=90% height="auto" onclick="playPauseVid(this)">
                    <source src="./Video/big_buck_bunny.mp4" type="video/mp4">
                </video>

                <div class="user_feedback">
                    <a class="tag">Useful</a>
                    <div class="emojis">
                        <span id="thumbUp_1" class="emoji" onclick="changeColor(this)">&#128077;</span>
                        <span id="thumbDown_1" class="emoji" onclick="changeColor(this)">&#128078;</span>
                    </div>
                </div>
            </div>

            <div class="contain_video_2">
                <div class="user_info">
                    <img src="./Image/3.jpg" alt="user_img">
                    <a class="video_name">Video Name</a>
                    <a class="date">2023/09/20</a>
                </div>
                <a class="video_description">Video description</a>

                <video id="myVideo_2" width=90% height="auto" onclick="playPauseVid(this)">
                    <source src="./Video/big_buck_bunny.mp4" type="video/mp4">
                </video>
                <div class="user_feedback">
                    <a class="tag">Useful</a>
                    <div class="emojis">
                        <span id="thumbUp_2" class="emoji" onclick="changeColor(this)">&#128077;</span>
                        <span id="thumbDown_2" class="emoji" onclick="changeColor(this)">&#128078;</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <script>
            function playPauseVid(vid) {
                if (vid.paused) {
                    vid.play();
                } else {
                    vid.pause();
                }
            }

            function changeColor(emojiSpan) {
                emojiSpan.classList.toggle('selected');
            }
        </script>
    </footer>


</body>

</html>