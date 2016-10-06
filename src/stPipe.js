ng.module('smart-table')
  .directive('stPipe', ['stConfig', '$timeout', function (config, $timeout) {
    return {
      require: 'stTable',
      scope: {
        stPipe: '='
      },
      link: {

        pre: function (scope, element, attrs, ctrl) {
            var _stPipe = scope.stPipe;

            for(var prop in scope.$parent) {
                if(scope.$parent.hasOwnProperty(prop)) {
                    if(((prop + '').indexOf('$') < 0) && ng.isFunction(scope.stPipe)
                        && ng.isFunction(scope.$parent[prop][scope.stPipe.name])) {
                        _stPipe = angular.bind(scope.$parent[prop], scope.stPipe);
                    }
                }
            }

          var pipePromise = null;

          if (ng.isFunction(_stPipe)) {
            ctrl.preventPipeOnWatch();
            ctrl.pipe = function () {

              if (pipePromise !== null) {
                $timeout.cancel(pipePromise)
              }

              pipePromise = $timeout(function () {
                _stPipe(ctrl.tableState(), ctrl);
              }, config.pipe.delay);

              return pipePromise;
            }
          }
        },

        post: function (scope, element, attrs, ctrl) {
          ctrl.pipe();
        }
      }
    };
  }]);
