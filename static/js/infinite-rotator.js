var infiniteLoop;
var InfiniteRotator =
    {
        init: function()
        {
            //initial fade-in time (in milliseconds)
            var initialFadeIn = 500;
 
            //interval between items (in milliseconds)
            var itemInterval = 5000;
 
            //cross-fade time (in milliseconds)
            var fadeTime = 2500;
 
            //count number of items
            var numberOfItems = $('.rotating-item').length;
 
            //set current item
            var currentItem = 0;
 
            //show first item
            $('.rotating-item').eq(currentItem).fadeIn(initialFadeIn);
            if (numberOfItems > 1){
                //loop through the items
                infiniteLoop = setInterval(function(){
                    $('.rotating-item').eq(currentItem).fadeOut(fadeTime);
    
                    if(currentItem == numberOfItems -1){
                        currentItem = 0;
                    }else{
                        currentItem++;
                    }
                    $('.rotating-item').eq(currentItem).fadeIn(fadeTime);
    
                }, itemInterval);
            }
        },
        stop:  ()=> {
            clearInterval(infiniteLoop);
        }

    };
$(window).load(function() { //start after HTML, images have loaded
    InfiniteRotator.init();
});