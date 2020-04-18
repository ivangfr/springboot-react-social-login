const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get("token")
if (token) {
    $.ajax({
        url: '/api/users/me',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        method: 'GET',
        success: function(data){
            console.log(data)
            $("#user").html(data.name)
            $(".unauthenticated").hide()
            $(".authenticated").show()
        }
    });
}

function logout() {
    $.post("/logout", function() {
        $("#user").html('')
        $(".unauthenticated").show()
        $(".authenticated").hide()
    })
    return true
}

$.ajaxSetup({
    beforeSend : function(xhr, settings) {
        if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE' || settings.type == 'PATCH') {
            xhr.setRequestHeader("X-XSRF-TOKEN", Cookies.get('XSRF-TOKEN'))
        }
    }
})