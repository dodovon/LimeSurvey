/*
 * LimeSurvey
 * Copyright (C) 2007 The LimeSurvey Project Team / Carsten Schmitz
 * All rights reserved.
 * License: GNU/GPL License v2 or later, see LICENSE.php
 * LimeSurvey is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses.
 * See COPYRIGHT.php for copyright notices and details.
 *
 *
 * Description: Javascript file for templates. Put JS-functions for your template here.
 *
 *
 * $Id:$
 */


/*
 * The function focusFirst puts the Focus on the first non-hidden element in the Survey.
 *
 * Normally this is the first input field (the first answer).
 */
function focusFirst(Event)
{

    $('#limesurvey :input:visible:enabled:first').focus();

}
/*
 * The focusFirst function is added to the eventlistener, when the page is loaded.
 *
 * This can be used to start other functions on pageload as well. Just put it inside the 'ready' function block
 */

/* Uncomment below if you want to use the focusFirst function */
/*
$(document).ready(function(){
    focusFirst();
});
*/


/**
 * Remake table @that with divs, by column
 * Used by array-by-column question type on
 * small screen
 *
 * TODO: remove all the HTML from this function.
 *
 * @param {object} that The table jQuery object
 * @return void
 */
function replaceColumnWithDiv(that) {
    var newHtml = '';
    var nrOfColumns = $(that).find('tr:first th').length;
    newHtml += "<div class='array-by-columns-div'>";
    for (var i = 0; i < nrOfColumns; i++)
    {
        // Fetch each column from the table and put content in div
        newHtml += "<div class='well radio-list array" + (i % 2 === 0 ? "2" : "1") + " '>";
        $(that).find('tr > *:nth-child('+ (i + 2) + ')').each(function(j) {
            // First one is header
            if (j === 0) {
                newHtml += "<div class='answertext'>";
                newHtml += $(this).html();
                newHtml += "</div>";
            }
            else {
                newHtml += "<div class='radio-item radio'>";
                newHtml += $(this).html();
                newHtml += "</div>";
            }
        });
        newHtml += "</div>";
    }
    newHtml += "</div>";
    $(that).replaceWith(newHtml);
}




$(document).ready(function()
{

    // Scroll to first error
    if($(".input-error").length > 0) {
        $('#bootstrap-alert-box-modal').on('hidden.bs.modal', function () {
            console.log('answer error found');
            $firstError = $(".input-error").first();
            $pixToScroll = ( $firstError.offset().top - 100 );
            $('html, body').animate({
                 scrollTop: $pixToScroll + 'px'
             }, 'fast');
        });
    }


    // Make the label clickable
    $('.label-clickable').each(function(){
        var $that    = $(this);
        var $inputEl = $("#"+$that.attr('id').replace("label-", ""));
        $that.on('click', function(){
            console.log($inputEl.attr('id'));
            $inputEl.trigger( "click" );
        });
    });

    $('.if-no-js').hide();

    // iPad has width 768, Google Nexus 10 width 800
    // It's OK to keep tables on pads.
    if($(window).width() < 768)
    {
        // Brutally remake the array-by-columns question type to divs,
        // because you can't wrap table columns
        $('.array-by-columns-table').each(function() {
            replaceColumnWithDiv(this);
        });

    }

    //var outerframeDistanceFromTop = 50;
    //topsurveymenubar
    var topsurveymenubarHeight = $('#topsurveymenubar').innerHeight();
    var outerframeDistanceFromTop = topsurveymenubarHeight;
    // Manage top container
    if(!$.trim($('#topContainer .container').html()))
    {
        $('#topContainer').hide();
    }
    else
    {
        $('#topContainer').css({
            top: topsurveymenubarHeight+'px',
        });

        $topContainerHeight = $('#topContainer').height();
        outerframeDistanceFromTop += $topContainerHeight;
    }

    if(!$.trim($('#surveynametitle').html()))
    {
        if(!$.trim($('#surveydescription').html()))
        {
            $('#survey-header').hide();
        }
    }

    $('#outerframeContainer').css({marginTop:outerframeDistanceFromTop+'px'});

    $('.language-changer').each(function(){
        $that = $(this);
        if(!$.trim($that.children('div').html()))
        {
            $that.hide();
        }
    });

    $('.group-description-container').each(function(){
        $that = $(this);
        if(!$.trim($that.children('div').html()))
        {
            $that.hide();
        }
    });

    // Hide question help container if empty
    $('.questionhelp').each(function(){
        $that = $(this);
        if(!$.trim($that.html()))
        {
            $that.hide();
        }
    });


    // Load survey button
    if ($('#loadallbtnlink').length > 0){
        $('#loadallbtnlink').on('click', function()
        {
            $('#loadallbtn').trigger('click');
        });
    }

    // Save survey button
    if ($('#saveallbtnlink').length > 0){
        $('#saveallbtnlink').on('click', function()
        {
            $('#saveallbtn').trigger('click');
        });
    }

    // clearall
    if ($('#clearallbtnlink').length > 0){
        $('#clearallbtnlink').on('click', function()
        {
            $('#clearall').trigger('click');
        });
    }

    // Question index
    if($('.linkToButton').length > 0){
        $('.linkToButton').on('click', function()
        {
            $btnToClick = $($(this).attr('data-button-to-click'));
            $btnToClick.trigger('click');
            return false;
        });
    }


    // Errors
    if($('.emtip').length>0)
    {
        // On Document Load
        $('.emtip').each(function(){
            if($(this).hasClass('error'))
            {
                $(this).parents('div.questionhelp').removeClass('text-info').addClass('text-danger');
            }
        });

        // On em change
        $('.emtip').each(function(){
            $(this).on('classChangeError', function() {
                $parent = $(this).parent('div.questionhelp');
                $parent.removeClass('text-info',1);
                $parent.addClass('text-danger',1);

                if ($parent.hasClass('hide-tip'))
                {
                    $parent.removeClass('hide-tip',1);
                    $parent.addClass('tip-was-hidden',1);
                }

                $questionContainer = $(this).parents('div.question-container');
                $questionContainer.addClass('input-error');
            });

            $(this).on('classChangeGood', function() {
                $parent = $(this).parents('div.questionhelp');
                $parent.removeClass('text-danger');
                $parent.addClass('text-info');
                if ($parent.hasClass('tip-was-hidden'))
                {
                    $parent.removeClass('tip-was-hidden').addClass('hide-tip');
                }
                $questionContainer = $(this).parents('div.question-container');
                $questionContainer.removeClass('input-error');
            });
        });
    }

    // Hide the menu buttons at the end of the Survey
    if($(".hidemenubutton").length>0)
    {
        $('.navbar-right').hide();
    }

    // Survey list footer
    if($('#surveyListFooter').length>0)
    {
        $surveyListFooter = $('#surveyListFooter');
        $('#outerframeContainer').after($surveyListFooter);
    }

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })


});


window.alert = function(message, title) {
    if($("#bootstrap-alert-box-modal").length == 0) {
        $("body").append('<div id="bootstrap-alert-box-modal" class="modal fade">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header" style="min-height:40px;">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title"></h4>\
                    </div>\
                    <div class="modal-body"><p></p></div>\
                    <div class="modal-footer">\
                        <a href="#" data-dismiss="modal" class="btn btn-default">Close</a>\
                    </div>\
                </div>\
            </div>\
        </div>');
    }
    $("#bootstrap-alert-box-modal .modal-header h4").text(title || "");
    $("#bootstrap-alert-box-modal .modal-body p").text(message || "");

    $(document).ready(function()
    {
        $("#bootstrap-alert-box-modal").modal('show');
    });
};
