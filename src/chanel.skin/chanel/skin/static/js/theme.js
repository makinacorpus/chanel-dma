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
$(document).ready(function() {
    chanel.planning.enable_choices();
});
