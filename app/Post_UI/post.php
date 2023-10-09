<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="post.css">
    <script>
        function displayFileName(event) {
            const input = event.target;
            const fileName = input.files[0].name;
            document.getElementById('selectedFileName').textContent = fileName;
        }

    </script>
</head>

<body>
    <div id="send">
        <h2>Send Your Post</h2>
    </div>
    <div class="flex-container">
        <div id="input">
            <form action="image.php" method="post" enctype="multipart/form-data">
                <div id="main" class="main">
                    <div class="EnterText">
                        <legend>Name your new video</legend>
                        <input type="text" id="VName" placeholder="Video Name" name="VName">
                    </div>

                    <div class="EnterText">
                        <legend>Choose a Group</legend>
                        <select id="GName" name="GName" onchange="updateMetrics(this.value)">
                            <option value=""></option>
                            <option value="Sender">Sender</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Professor">Professor</option>
                        </select>
                    </div>

                    <div class="EnterText">
                        <legend>Description of Your Video</legend>
                        <input type="text" id="Description" placeholder="Describe your video" name="description">
                    </div>

                </div>
                <div id="choose">
                    <label class="custom-file-upload">
                        <input type="file" name="file" id="file"
                            accept="video/mp4, video/avi, video/webm, video/mkv, audio/mpeg"
                            onchange="displayFileName(event)">
                        Select File
                    </label>
                    <span id="selectedFileName"></span>

                </div>
                <div id="button">
                    <button type="submit" value="Submit" name="submit" id="submit">Submit</button>
                </div>
        </div>
        <div id="HistroyBar">
            <table id="histroyTable">
                <thead>
                    <tr>
                        <td>Histroy</td>
                        <td id="Sort">
                            <select id="order" name="order">
                                <option value="Des">Descending</option>
                                <option value="Asc">Ascending</option>
                            </select>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="img"><img src="image\1.jpg">User1</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                    <tr>
                        <td id="img"><img src="image\2.jpg">User2</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                    <tr>
                        <td id="img"><img src="image\3.jpg">User3</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                    <tr>
                        <td id="img"><img src="image\1.jpg">User1</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                    <tr>
                        <td id="img"><img src="image\2.jpg">User2</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                    <tr>
                        <td id="img"><img src="image\3.jpg">User3</td>
                        <td id="date">2023/09/09</td>
                    </tr>
                </tbody>
            </table>
        </div>



        </form>
    </div>


    </div>

</body>

</html>