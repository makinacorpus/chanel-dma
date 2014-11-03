
chanel = {};
chanel.planning = {};

chanel.planning.error_dates_message = "Planning can't be saved/submitted if all date fields from active movies are not filled.";

chanel.planning.showFlowPopup = function() {

    // set up button action. it will fire our overlay
    $(".title span[rel]").overlay({
        // when overlay is opened, load our player
        fixed: true,
        onLoad: function() {
            var preview_url = this.getTrigger().attr("data-url");
            var config = jQuery.extend(true, {}, window.collective_flowplayer.config);
            config.clip.baseUrl = preview_url
            config.clip.url = preview_url;
            var player = $f("player", window.collective_flowplayer.params, config);
        },
 
        // when overlay is closed, unload our player
        onClose: function() {
            //player.unload();
        }
    });
};

chanel.planning.enable_choices = function() {
    $('.planning-table input[type="radio"]').click(function() {
        if(this.value=='Y') {
            $(this).parents('.movie-cell').removeClass('no');
            $(this).parents('.movie-cell').addClass('yes');
            $(this).parents('.movie-cell').find('input[type="date"]').removeAttr('disabled');
        } else if(this.value=='N') {
            $(this).parents('.movie-cell').removeClass('yes');
            $(this).parents('.movie-cell').addClass('no');
            $(this).parents('.movie-cell').find('input[type="date"]').attr('disabled', 'disabled').val("");
        } else {
            $(this).parents('.movie-cell').removeClass('yes');
            $(this).parents('.movie-cell').removeClass('no');
            $(this).parents('.movie-cell').find('input[type="date"]').attr('disabled', 'disabled').val("");
        }
        chanel.planning.manage_show_submit();
        chanel.planning.disable_replication();
    });
};

chanel.planning.check_all_is_done = function(){
    return $(".planning-table .movie-cell .actions :checked[value=X]").length === 0
}

chanel.planning.check_is_already_locked = function(){
    var field = JSON.parse($("#planning_locked").val()||false);
    return field === true;
}

chanel.planning.manage_show_submit = function(){
    if( $('form[name="frmShopProgram"]').attr("method") !=="get" ){
        if(chanel.planning.check_is_already_locked() === false){
            if(chanel.planning.check_all_is_done() === true){
                // ready
                $(".sp_workflow>[rel=lock]").enable(true);
                $(".sp_workflow>[rel=unlock]").hide();
                $(".sp_workflow").removeClass("disabled");
            }
            else{
                // not ready
                $(".sp_workflow").addClass("disabled");
                $(".sp_workflow>button").enable(false);       
            }
        }
        else{
            $(".sp_workflow").addClass("disabled");
            //$(".sp_actions .sp_workflow>[rel=unlock]").show();
            //$(".sp_actions").find(".sp_reset>button,.save>input").enable(false);
            //$(".planning-table input").enable(false);
        }
    }
    else{
       $(".sp_workflow").addClass("disabled");
        // in read mode
        //$(".sp_actions").find(".sp_workflow, .save, .sp_reset, .sp_override").enable(false);
        //$(".planning-table input").enable(false);
    }
}

chanel.planning.event_onsubmit = function() {
     $(".sp_workflow>[rel=lock]").click(function(event){
        event.preventDefault();
        var choice = confirm("After submit, changes on this planning won't be allowed");
        if (choice) {
            $("#planning_locked").val("true");
            $("form[name='frmShopProgram'] input[name='save']").click();
        }
    });
     $(".sp_workflow>[rel=unlock]").click(function(event){
        event.preventDefault();
        $("#planning_locked").val("false");
        $("form[name='frmShopProgram'] input[name='save']").click();
    });
}

chanel.planning.event_onsave = function() {
    // fix
    $(".actions input[checked=checked]").propAttr('checked',true);
    
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
        $form = $(this).parents("form:first");
        $form.submit();
    });
};

chanel.planning.event_onreset = function(){
    $(".sp_reset button").click(function(event){
        event.preventDefault();
        $(".planning-table input[type=radio][value=X]").click();
    });
}

chanel.planning.disable_replication = function(){
    $(".sp_override a").addClass("disabled").parent().attr("title","First, you need to save last changes before using this feature or F5");
}

chanel.initPortletNavigation = function(){
    $('#portlet_navigation > ul > li:has(ul)').addClass("has-sub");
    $('#portlet_navigation > ul > li> ul > li> a,#portlet_navigation > ul > li> a').click(function(event) {
        event.preventDefault();
        var checkElement = $(this).next();


        //$('#portlet_navigation li').removeClass('active');
        $(this).closest('li').addClass('active');   

        if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp('normal');
        }

        if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $(this).parents("ul").eq(0).find('ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
        }

        if (checkElement.is('ul')) {
            return false;
        } else {
            return true;    
        }
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
    $('input[type=date]').change(chanel.planning.disable_replication);
};

$(document).ready(function() {
    chanel.planning.enable_choices();
    chanel.planning.event_onsave();
    chanel.planning.event_onsubmit();
    chanel.planning.event_onreset();
    chanel.initPortletNavigation();
    chanel.planning.showFlowPopup();
    $('.movie-cell i').tooltip({ 
                                relative:true,
                                effect:"fade",
                                offset: [-12,0]
                              });
    if(!Modernizr.inputtypes.date){
        chanel.initDatepicker();
    }

});