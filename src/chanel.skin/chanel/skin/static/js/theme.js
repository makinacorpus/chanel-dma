chanel = {};
chanel.planning = {};

chanel.planning.enable_choices = function() {
    $('.planning-table input[type="radio"]').change(function() {
        if(this.value=='Y') {
            $(this).parents('.movie-cell').removeClass('no');
            $(this).parents('.movie-cell').addClass('yes');
            $(this).parents('.movie-cell').find('input[type="date"]').removeAttr('disabled');
        } else if(this.value=='N') {
            $(this).parents('.movie-cell').removeClass('yes');
            $(this).parents('.movie-cell').addClass('no');
            $(this).parents('.movie-cell').find('input[type="date"]').attr('disabled', 'disabled');
        } else {
            $(this).parents('.movie-cell').removeClass('yes');
            $(this).parents('.movie-cell').removeClass('no');
            $(this).parents('.movie-cell').find('input[type="date"]').attr('disabled', 'disabled');
        }
    });
};

chanel.planning.event_onsave = function() {
    $('form[name="frmShopProgram"] input[name="save"]').click(function(event){
        event.preventDefault();

        var results = {}

        var $displays = $(".movies-row .movies-column");

        /** loop on displays **/
        for (var i = 0; i < $displays.length; i++) {
            var $display = $displays.eq(i);
            var $movies = $(".movie-cell", $display);

            var display_id = $display.attr("rel");
            results[display_id] = {};
            /** loop on movies for a specific display **/
            for (var j = 0; j < $movies.length; j++) {
                var $movie = $movies.eq(j);
                var $dates = $("[type=date]", $movie);

                var status = $("[type=radio]:checked", $movie).val() || "";
                var date1 = $dates.eq(0).val();
                var date2 = $dates.eq(1).val();

                results[display_id][$movie.attr("rel")] = { status: status, start_date: date1, end_date: date2 };
            }
        };
        $("#planning_data").val(JSON.stringify(results));
        console.log(results);
        $form = $(this).parents("form:first");
        //form.attr("method", "POST").attr("action", "saveDocument");
        $form.submit();
    });
};

chanel.initDatepicker = function() {
    $('input[type=date]').each(function() {
        var $input = $(this);
        $input.datepicker({
            minDate: $input.attr('min'),
            maxDate: $input.attr('max'),
            dateFormat: 'yy-mm-dd'
        });
    });
};

$(document).ready(function() {

    chanel.planning.enable_choices();
    chanel.planning.event_onsave();

    if(!Modernizr.inputtypes.date){
        chanel.initDatepicker();
    };

});