let mrooms = [], mresverations = [], memployees = [];

$(function() {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = Object.fromEntries(urlSearchParams.entries());
    booking(params);
});

var booking = function(parms) {
    let r_id = parms.r_Id;
    $.ajax({
        type: "POST",
        url: "/roomDetails",
        contentType: 'application/json',
        success: function(res) {
            let rhtml = '', shtml = '', thtml = '', r_name = '', r_cp = '', croom = [];
            mrooms = res.rooms; memployees = res.employees; mresverations = res.resverations;
            mrooms.forEach(element => { rhtml += "<option value="+ element.room_id +">"+ element.room_name +"</option>"; });
            memployees.forEach(element => { shtml += "<span class='bk_team-span' onclick='empSelection(this);' emp-id="+ element.emp_id +">"+ element.emp_name +"</span>"; });

            if (r_id) croom = mrooms.filter((x) => { return x.room_id == r_id })[0];
            else { croom = mrooms[0]; r_id = croom.room_id; };
            r_name = croom.room_name; r_cp = croom.room_capacity;

            let resverations =  mresverations.filter((x) => { return x.room_id == r_id && new Date(x.res_start) > new Date(); });
            if (resverations.length > 0) {
                resverations.forEach((r) => { 
                    let st = new Date(r.res_start).toLocaleTimeString().replace(/(.*)\D\d+/, '$1'), et = new Date(r.res_end).toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
                    thtml += "<span class='bk_cbk-span' res-id="+ r._id +">"+ st + ' - ' + et +"</span>"; 
                });
            }
            else thtml += "<span>No bookings today...</span>"; 
            $('.bk_rooms, .bk_team, .bk_cbk-tbk').html('');
            $('.bk_rooms').append(rhtml); $('.bk_team').append(shtml); $('.bk_cbk-tbk').append(thtml);
            $('.bk_rm-name').html(r_name); $('.bk_rm-cp').html("No.of Seats : " + r_cp); 
            $('.room_class').hide(); $('.book_class').show();           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("error");
        },
    });
}

var empSelection = function(el) {
    $(el).removeClass('fillValue');
    if ($(el).hasClass('selected')) $(el).removeClass('selected');
    else $(el).addClass('selected'); 
}

var bkChange = function(el) {
    let r_id = $(el).val(), thtml = '',
        croom = mrooms.filter((x) => { return x.room_id == r_id })[0],
        r_name = croom.room_name, r_cp = croom.room_capacity,
        resverations =  mresverations.filter((x) => { return x.room_id == r_id && new Date(x.res_start) > new Date(); });

    if (resverations.length > 0) {
        resverations.forEach((r) => { 
            let st = new Date(r.res_start).toLocaleTimeString().replace(/(.*)\D\d+/, '$1'), et = new Date(r.res_end).toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
            thtml += "<span class='bk_cbk-span' res-id="+ r._id +">"+ st + ' - ' + et +"</span>"; 
        });
    }
    else thtml += "<span style='margin-left: 10px;'>No bookings today...</span>"; 

    $('.bk_cbk-tbk').html('').append(thtml);
    $('.bk_rm-name').html(r_name); $('.bk_rm-cp').html("No.of Seats : " + r_cp);
}

var bkSumbit = function(el) {
    let  bk_rmId= $('.bk_rooms').val(), bkf_date = $('.bk_stime').val(), bkt_date = $('.bk_ttime').val(), 
        bk_purpose = $('.bk_tarea').val(), bk_tm = $('.bk_team-span.selected'), valid = true, bk_tm_ar = [];
    
    if (bkf_date == "") { valid = false; $('.bk_stime').addClass('fillValue'); }
    if (bkt_date == "") { valid = false; $('.bk_ttime').addClass('fillValue'); }
    if (bk_purpose == "") { valid = false; $('.bk_tarea').addClass('fillValue'); }
    if (bk_tm.length == 0) { valid = false; $('.bk_team').addClass('fillValue'); }

    if (!valid) return false;

    bkf_date = new Date(bkf_date); bkt_date = new Date(bkt_date); 
    let al_bk = mresverations.filter((x) => { return x.room_id == bk_rmId && ((bkf_date < new Date(x.res_start) && new Date(x.res_start) < bkt_date)  || (bkf_date < new Date(x.res_end) && new Date(x.res_end) < bkt_date)) })[0];
    
    if (al_bk) return false;

    bk_tm.each((x, elment) => {
        bk_tm_ar.push($(elment).attr('emp-id'));
    });

    let data = { room_id: bk_rmId, res_emp: 'SE-01', res_start: bkf_date, res_end: bkt_date, res_agenda: bk_purpose, res_members: bk_tm_ar };
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: "/reservation/add",
        contentType: 'application/json',
        data: data,
        success: function(res) {
            mresverations = res.resverations;
            alert("success");
            bkReset();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("error");
        },
    });
}

var bkReset = function(el) {
    $('.bk_stime, .bk_ttime, .bk_tarea').val('');
    $('.bk_rooms')[0].selectedIndex = 0; $('.bk_rooms').change();
    $('.bk_team-span').removeClass('selected');
}

var clearFillValue = function(el) {
    $(el).removeClass('fillValue');
}