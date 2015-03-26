angular.module('app')

.directive('ngSelect', [function() {
    return function(scope, ele, attr) {
        ele.on('click', function() {
            if (document.body.createTextRange) { // ms
                var range = document.body.createTextRange();
                range.moveToElementText(ele);
                range.select();
            } else if (window.getSelection) { // moz, opera, webkit
                var selection = window.getSelection();            
                var range = document.createRange();
                range.selectNodeContents(ele[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }
}]);