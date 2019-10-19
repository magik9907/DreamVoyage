
    (function () {
        var inputs = document.querySelectorAll('input, select, textarea');
        var setDirty = function () {
            this.classList.add('field-dirty');
        };

        for (var i=0, l=inputs.length; i<l; i++) {
            inputs[i].onblur = setDirty;
        }
    })();
