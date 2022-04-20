var createRoom = function() {
    $('.popup-mask').show();
    $('.ar_room-popup').show();
    $('.ar_room-Idtext, .ar_room-nametext, .ar_room-cptext, .ar-room-textarea, .ar-roomFile').removeClass('fillValue');
    return false;
}

var imageCoverter = function(el) {
    $(el).removeClass('fillValue');
    let file = el && el.files[0];
    if (file) {
        let fileLoader = new FileReader();

        fileLoader.onload = function () {
            $('.ar_room-img').attr('src', this.result);
            $('.ar_room-img').css({width: '150px', height: '150px'});
            $('.ar_room-img')[0].style.display = 'block';
        };

        if ( file.type.match( 'image.*' ) )
           fileLoader.readAsDataURL( file );
        else
            alert('File is not an image');
    }
    else
        alert( 'Choose a File' );
}

var addRoomClose = function() {
    addRoomReset();
    $('.popup-mask').hide();
    $('.ar_room-popup').hide();
}

var addRoomReset = function() {
    $('.ar_room-Idtext, .ar_room-nametext, .ar_room-cptext, .ar-room-textarea, .ar-roomFile').val('');
    $('.ar_room-img')[0].style.display = 'none';
}

var addRoomSubmit = function() {
    let  ar_roomId = $('.ar_room-Idtext').val(), ar_roomName = $('.ar_room-nametext').val(), ar_roomcp = $('.ar_room-cptext').val(), 
         ar_roomTextArea = $('.ar-room-textarea').val(), ar_roomFile = $('.ar-roomFile').val(), valid = true;

    if (ar_roomId == "") { valid = false; $('.ar_room-Idtext').addClass('fillValue'); }
    if (ar_roomName == "") { valid = false; $('.ar_room-nametext').addClass('fillValue'); }
    if (ar_roomcp == "") { valid = false; $('.ar_room-cptext').addClass('fillValue'); }
    if (ar_roomTextArea == "") { valid = false; $('.ar-room-textarea').addClass('fillValue'); }
    if (ar_roomFile == "") { valid = false; $('.ar-roomFile').addClass('fillValue'); }

    if (!valid) return false;

    let src = $('.ar_room-img')[0].src;
    let data = { room_id: ar_roomId, room_name: ar_roomName, room_capacity: ar_roomcp, room_status: true, room_note: ar_roomTextArea, room_image: src };
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "/rooms/add",
        contentType: 'application/json',
        data: data,
        success: function(res) {
            addRoomClose();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("error");
        },
    });
}

var clearFillValue = function(el) {
    $(el).removeClass('fillValue');
}