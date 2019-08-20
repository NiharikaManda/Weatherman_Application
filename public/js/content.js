$(document).ready(function(){
    $('#signup').change(function(){
        var url="http://localhost:3000/trackUser?";
        [].forEach.call(document.querySelector('#signup').elements, function(el) {
            localStorage.setItem(el.name, el.value);
            if(el.value){
                url+=el.name+"="+el.value+"&";
            }
        });

        $.get( url, function( data ) {
            $( ".result" ).html( data );
            console.log("user sign up is tracked");
        });
    });
});