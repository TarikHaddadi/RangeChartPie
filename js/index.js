(function ($) {
  rangeChartClass = function (el, opts) {
    var it = this,
      random = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    // Options should be an object:
    /*{
          choices: [{
            label: "data",
            id: ,
            min: null,
            max: 100,
            interval: [{
              unitPrice: 10,
              label: 0
            }, {
              unitPrice: 20,
              label: 50
            }, {
              unitPrice: 30,
              label: 100
            }],
            value: 0,
            step: 1,
            unit: '(m)',
            unitPrice: 5,
            unitPriceCurrency: 'dhs',
            limit: null
          }],
          currencyLabel: "dhs",
          dozeVAlInit: 0,
          dir: 'ltr'
        }

     * @param label: string (label to be displayed on the graph and beside
     * the dragger input),
     *
     * @param min: integer or null (min value of the dragger input),
     *
     * @param max: integer (max value of the dragger input),
     *
     * @param interval: array or null,
     *  if array =>
     *    @param unitPrice: integer (unit price per interval)
     *    @param label: integer (value to be displayed on the custom dragger input,
     *    max value of this param shoud be equal to @param max and min value of this param shoud be equal to @param min or greater),
     *  if null =>
     *    the min value shoud equal to zero and set the max value of the dragger
     *
     * @param value: integer (init value of the dragger input),
     *
     * @param step: integer => min value is 1 (step of the dragger input),
     *
     * @param unit: string => ex: "(h)" (unit value displayed on the graph and on
     * the infobox under the dragger input if @param interval is null ),
     *
     * @param unitPrice: integer (unit value displayed on the graph and on the
     * infobox under the dragger input if @param interval is null ),
     *
     * @param unitPriceCurrency: string => ex : 'dollar' (currency displayed at
     * the center of the graph while calculating sum),
     *
     * @param limit: integer or null ( limit should be equal or less than @param max )
     *
     * @param showpie: If we want to show the Graph chart
     *    default value is true
     *
     * @param showunlimited: If we want to show unlimited checkbox at the left of custom draggers
     *    default value is true
     *
     * @param showunicons: If we want to show icons at the left of custom draggers
     *    default value is true
     * */

    // Mergin options with defaults.
    var data = opts;
    /*
     * @param choives: array,
     * */
    var choices = data.choices;
    /*
     * @param currencyLabel: string => ex : 'dollar',
     * */
    var currencyLabel = data.currencyLabel;
    /*
     * @param dozeVAlInit: integer,
     * */
    var dozeVAlInit = data.dozeVAlInit;
    /*
     * @param dir: string => ex 'ltr' or 'rtl',
     * */
    var dir = data.dir;
    /*
    * If we want to show the Graph chart
    * @param showPie: true or false,
    * */
    var showpie = data.showPie;
    /*
    * If we want to show unlimited checkbox at the left of custom draggers
    * @param showUnlimited: true or false,
    * */
    var showunlimited = data.showUnlimited;
    /*
    * If we want to show icons at the left of custom draggers
    * it shoud be setted at true if showPie is true
    * @param showIcons: true or false,
    * */
    var showicons = data.showIcons;

    var radius = 0,
      number = 0,
      sum = 0,
      thick = 0,
      margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
      },

      canvasWidth = 0,
      canvasHeight = 0,
      color = d3.scale.category10(),
      pi = Math.PI; // 3.14

    if ($(window).width() <= 768) {
      radius = 120;
      thick = 1.5;
      canvasWidth = 320;
      canvasHeight = 320;
    }
    else {
      radius = 180;
      thick = 1.4;
      canvasWidth = radius * 2 + margin.left + margin.right;
      canvasHeight = radius * 2 + margin.top + margin.bottom;
    }

    // pie chart config
    var pie = d3.layout.pie()
      .value(function (d, i) {
        return d.value;
      })
      .sort(null);

    // arc object
    var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius / thick);


    // Appending html adapted to the pie and drag inputs content
    this.appendHtml = function (direction, dataArray, currency) {
      var containerdir = "",
        piedir = "ltr";

      // Set direction
      if (direction === "rtl") {
        containerdir = "rtl";
      }
      else {
        containerdir = "ltr";
      }

      // If atribute showPie is true
      if (showpie) {
        $(el).addClass(random).append('<div id="rangeChart" class="' + random + '" dir="' + containerdir + '">' +
          '<div class="chart-zone">' +
          '<form class="formSubmit">' +
          '<div id="chart-controls">' +
          '<table id="rangebox">' +
          '<tbody></tbody>' +
          '</table>' +
          '<button type="submit" class="submit">Envoyer</button>' +
          '<button class="init">Reinitialiser</button>' +
          '<button class="print">Imprimer</button>' +
          '</div>' +
          '<div id="pie" dir="' + piedir + '">' +
          '<span class="animated pulse"><img src="imgs/chart_icon.svg" style="width: 48px;" alt=""></span>' +
          '<div id="chart-dozer">' +
          '<div>' +
          '<label for="amount">Max Amount in : ' +
          '<span></span>' +
          '<input type="number" id="amount" placeholder="0.00" required min="0" value="" step="0.01" title="Currency" pattern="^\d+(?:\.\d{1,2})?$">' +
          '</label>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<input type="text" name="Total" class="sumvalueInput" hidden value="">' +
          '</form></div>' +
          '</div>');
      }
      else {
        $(el).addClass(random).append('<div id="rangeChart" class="' + random + '" dir="' + containerdir + '">' +
          '<div class="chart-zone">' +
          '<form class="formSubmit">' +
          '<div id="chart-controls">' +
          '<table id="rangebox">' +
          '<tbody></tbody>' +
          '</table>' +
          '<button type="submit" class="submit">Envoyer</button>' +
          '<button class="init">Reinitialiser</button>' +
          '<button class="print">Imprimer</button>' +
          '</div>' +
          '<input type="text" name="Total" class="sumvalueInput" hidden value="">' +
          '</form></div>' +
          '</div>' +
          '</div>');
      }

      it.d3Init(currency, dataArray);
    };

    // D3 init and appending elements from given options
    this.d3Init = function (currency, dataArray) {
      d3.select('.' + random + ' #rangebox tbody').html('');
      d3.select('.' + random + ' #chart-dozer label span').html(currency);

      // append sliders to table
      for (var i = 0; i < dataArray.length; i++) {
        var tr = d3.select('.' + random + ' #rangebox tbody').append('tr');

        if (showicons) {
          // Appending colored box next  dragger input
          tr.append('td')
            .attr('class', 'edit')
            .attr('bgcolor', function (d, i) {
              return color(i)
            })
            .attr('contenteditable', false)
            .text(dataArray[i].label.toUpperCase())
            .append('img')
            .attr('src', dataArray[i].picto);
        }

        // Appending colored box next  dragger input
        var unlimited = tr.append('div')
          .attr('class', "unlimited");

        // If showUnlimited attribute is true we append the unlimtied checkbox
        unlimited.append('p')
          .html(dataArray[i].label.toUpperCase());

        if (showunlimited) {
          unlimited.append('input')
            .attr('id', 'unlimited' + i)
            .attr('type', 'checkbox');

          unlimited.append('label')
            .attr('for', "unlimited" + i)
            .html(" Illimité");
        }

        var draggerContainer = tr.append('td')
          .attr('class', 'dragger_container');

        var dragger = draggerContainer.append('div')
          .attr('class', "dragger")
          .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
          .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
          .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
          .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
          .attr('data-default', dataArray[i].startValue);

        // If interval is null we set each dragger init unitPrice depending to
        // its value area
        var _unitPrice = 0;
        if (dataArray[i].interval !== null) {
          if (dataArray[i].startValue > 0) {
            _unitPrice = dataArray[i].interval.filter(function (item, idx) {
              return item.value < dataArray[i].startValue;
            }).slice(-1)[0].unitPrice;
          }
          else {
            _unitPrice = dataArray[i].interval.filter(function (item, idx) {
              return item;
            })[0].unitPrice;
          }
        }
        else {
          _unitPrice = dataArray[i].unitPrice;
        }

        dragger.append('input')
          .attr('type', 'range')
          .attr('name', dataArray[i].label.replace(" ", '_').toLowerCase())
          .attr('data-id', i)
          .attr('data-unit', dataArray[i].unit)
          .attr('data-unit-price', _unitPrice)
          .attr('data-unit-price-currency', currency)
          .attr('class', 'range')
          .attr('step', dataArray[i].step ? dataArray[i].step : 1);

        var percentFill = dragger.append('div')
          .attr('class', "percentFill");

        percentFill.append('span')
          .html(dataArray[i].startValue);

        var disabledFill = dragger.append('div')
          .attr('class', "disabledFill");


        var disabledFillUnlimited = dragger.append('div')
          .attr('class', "disabledFillUnlimited");

        var disabledFillMin = dragger.append('div')
          .attr('class', "disabledFillMin");

        var content = dragger.append('div')
          .attr('class', "content");

        content.append('div')
          .attr('class', "item")
          .attr('data-value', 0)
          .attr('data-size', dataArray[i].unit)
          .append('span');

        if (dataArray[i].interval !== null && dataArray[i].interval) {
          if (dataArray[i].interval.length > 1) {
            for (var j = 0; j < dataArray[i].interval.length; j++) {
              content.append('div')
                .attr('class', "item")
                .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
                .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
                .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
                .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
                .attr('data-value', dataArray[i].interval[j].value ? dataArray[i].interval[j].value : 0)
                .attr('data-size', dataArray[i].unit)
                .append('span');
            }
          }
          else if (dataArray[i].interval.length === 1) {
            content.append('div')
              .attr('class', "item")
              .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
              .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
              .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
              .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
              .attr('data-value', dataArray[i].max ? dataArray[i].max : 0)
              .attr('data-size', dataArray[i].unit)
              .append('span');
            for (var k = 0; k < dataArray[i].interval.length; k++) {
              content.append('div')
                .attr('class', "item")
                .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
                .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
                .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
                .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
                .attr('data-value', dataArray[i].interval[k].value ? dataArray[i].interval[k].value : 0)
                .attr('data-size', dataArray[i].unit)
                .append('span');
            }
          }
        }
        else {
          content.append('div')
            .attr('class', "item")
            .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
            .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
            .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
            .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
            .attr('data-value', dataArray[i].min ? dataArray[i].min : 0)
            .attr('data-size', dataArray[i].unit)
            .append('span');

          content.append('div')
            .attr('class', "item")
            .attr('data-limit-val', dataArray[i].limit ? dataArray[i].limit : 0)
            .attr('data-limit', dataArray[i].limit ? dataArray[i].limit : 0)
            .attr('data-max', dataArray[i].max ? dataArray[i].max : 0)
            .attr('data-min', dataArray[i].min ? dataArray[i].min : 0)
            .attr('data-value', dataArray[i].max ? dataArray[i].max : 0)
            .attr('data-size', dataArray[i].unit)
            .append('span');
        }

        var draggerControls = tr.append('td')
          .attr('class', 'dragger_controls');

        draggerControls
          .append('span')
          .attr('class', 'plus')
          .html('+');

        draggerControls
          .append('span')
          .attr('class', 'minus')
          .html('-');
      }
    };

    // Initialize the sliders, events and pie chart
    this.init = function (dataArray, currency, dozerValue, direction) {
      // Removing content before appending chart and input range content
      $('.' + random + ' #rangeChart').remove();

      // Append html adapted to the pie
      it.appendHtml(direction, dataArray, currency);


      // Var declarations
      var $dragger = $(el).find('.dragger'),
        $range = $(el).find('.range'),
        $unlimited = $(el).find('.unlimited'),
        $dragger_item = $(el).find('.item'),
        $amount = $(el).find('#amount'),
        $dragger_controls = $(el).find('.dragger_controls'),
        inputDozerInitValue = 0,
        $print_buton = $(el).find('.print'),
        $form_submit = $(el).find('.formSubmit'),
        $toggle_pieChart = $(el).find('#pie > span'),
        $reset_button = $(el).find('.init');

      /*
      * Updating draggers
      * */

      it.fillInitValues($dragger, $dragger_item, direction);

      it.dozer($amount, dozerValue, inputDozerInitValue, currency);
      it.dragRange($range, dataArray, currency);

      it.unlimited($unlimited, $dragger_controls);
      it.draggerControls($dragger_controls);

      it.print($print_buton);
      it.submitForm($form_submit);
      it.reset($reset_button);
      it.showHideChart($toggle_pieChart);

      it.showValues();
      it.seteditboxcolor();
      it.pieChart(dataArray, currency, dozerValue);
    };

    // Dragger fill initial values
    this.fillInitValues = function (dragger_elem, dragger_item, direction) {
      // Setting val_max and val_min & appending intervals
      dragger_item.each(function (idx, itm) {
        var dataValue = parseInt($(itm).attr('data-value'), 10),
          val_min = parseInt($(itm).attr('data-min'), 10),
          val_max = parseInt($(itm).attr('data-max'), 10),
          disabledFillMin = $(itm).closest('.dragger').find(".disabledFillMin"),
          limit = parseInt($(itm).attr('data-limit'), 10),
          max = val_max > 0 ? val_max : 1,
          calculate = (dataValue / max) * 100,
          dragger = $(itm).closest('.dragger');

        // calculate every position of the range given values
        var dir = "";
        if (direction === "rtl") {
          dir = "margin-right";
        }
        else {
          dir = "margin-left";
        }
        $(itm).css(dir, calculate + '%');

        disabledFillMin.css('width', val_min / max * 100 + "%");

        // Add attribute which contains the minim value percent in view to use
        // it while dragging the range
        dragger.attr('data-min-percent', (val_min / max) * 100);
        // Setting the limit parcent
        dragger.attr('data-limit', (limit / max) * 100);
      });

      // Fill the dragger and percentFill with the init values
      dragger_elem.each(function (idx, item) {
        var itemInput = $(item).find(".range"),
          percentFill = $(item).find(".percentFill"),
          percentFillText = $(item).find(".percentFill span"),
          disabledFill = $(item).find(".disabledFill"),
          disabledFillMin = $(item).find(".disabledFillMin"),
          dataDefault = parseInt($(this).attr('data-default'), 10),
          dataMax = parseInt($(this).attr('data-max'), 10),
          dataLimit = parseInt($(this).attr('data-limit-val'), 10),
          percent = ((dataDefault / dataMax) * 100);

        itemInput.attr('value', $(this).attr('data-default'), dataDefault).attr('max', dataMax).attr('min', 0);
        percentFill.css('width', percent + "%");

        if (dataLimit > 0) {
          disabledFill.css('width', (100 - ((dataLimit / dataMax) * 100)) + "%");
        }

        var _calculatedValue = parseInt(itemInput.attr('value'), 10);
        var _price = parseInt(itemInput.attr('value'), 10) * parseInt(itemInput.data('unit-price'), 10);
        // Fill the tooltip with informations
        percentFillText.html(_calculatedValue + " " + itemInput.data('unit') +
          " = <span>" + _price.toFixed(2) +
          " " + itemInput.data('unit-price-currency') +
          "</span> <i> " + itemInput.data('unit-price') +
          itemInput.data('unit-price-currency') + " / " +
          itemInput.data('unit') + '</i>');
      });
    };

    // Binding dozer input value
    this.dozer = function (amount, dozerValue, inputDozerInitValue, currency) {
      if (parseInt(dozerValue, 10) > 0) {
        inputDozerInitValue = dozerValue.toFixed(2);
      }
      else {
        inputDozerInitValue = parseInt(0, 10).toFixed(2);
      }

      // Set the init value if it setted on the object
      amount.val(inputDozerInitValue);

      // amount setter event on input
      amount.on('input', function () {
        it.updateDozerConsumption(this.value, currency);
        it.updateConsumption(it.calculateSum(), currency);
      });
    };

    // Dragger change and input  event
    this.dragRange = function (range, dataArray, currency) {
      range.each(function (idx, item) {
        // Autocalculate tooltip position
        $(this).on('input change', function () {
          var that = this;
          setTimeout(function () {
            it.bindRangeChanges(dataArray, that, idx, currency);
          }, 200);
        });
      });
    };

    // Unlimited checkbox event on input
    this.unlimited = function (unlimited_checkbox, dragger_controls) {
      unlimited_checkbox.each(function (idx, item) {
        // Autocalculate tooltip position
        $(this).find('input').on('change', function () {
          // Disabling input range when unlimited is checked
          if ($(this).is(':checked')) {

            $(this).closest('tr').addClass('unlimited-item');
            $(this).closest('tr').find('.disabledFillUnlimited').css('width', '100%');
            // hide minus and plus buttons when illimited is selected
            $(this).closest('tr').find(dragger_controls).find('span').css({
              'visibility': 'hidden',
              'opacity': 0
            });
            // add attribute disabled to input when unlimited is selected
            $(this).closest('tr').find('input[type="range"]').attr('data-old', $(this).closest('tr').find('input[type="range"]').val()).attr('disabled', true);
            $(this).closest('tr').find('input[type="range"]').val(0).change();

            it.showUnlimitedWarn(idx);
          }
          else {
            $(this).closest('tr').removeClass('unlimited-item');

            $(this).closest('tr').find('.disabledFillUnlimited').removeAttr('style');
            // show minus and plus buttons when illimited is unselected
            $(this).closest('tr').find(dragger_controls).find('span').css({
              'visibility': 'visible',
              'opacity': 1
            });
            // remove attribute disabled from input when unlimited is unselected
            $(this).closest('tr').find('input[type="range"]').attr('disabled', false);
            $(this).closest('tr').find('input[type="range"]').val($(this).closest('tr').find('input[type="range"]').attr('data-old')).change();

            it.showUnlimitedWarn(idx);
          }
        });
      });
    };

    // Plus and minus buttons click event
    this.draggerControls = function (dragger_controls) {
      dragger_controls.each(function (idx, item) {
        var minusBtn = $(item).find('.minus'),
          plusBtn = $(item).find('.plus');

        minusBtn.click(function () {
          var inputDragger = $(this).closest('tr').find('input[type="range"]'),
            inputDraggerValue = parseInt(inputDragger.val(), 10) - 1;
          // Trigger input change while decreasing its value
          inputDragger.val(inputDraggerValue).change();
        });

        plusBtn.click(function () {
          var inputDragger = $(this).closest('tr').find('input[type="range"]'),
            inputDraggerValue = parseInt(inputDragger.val(), 10) + 1;
          // Trigger input change while increasing its value
          inputDragger.val(inputDraggerValue).change();
        });
      });
    };

    // print button event
    this.print = function (print_button) {
      print_button.click(function (e) {
        window.print();
        e.preventDefault();
      });
    };

    // Form submit click event.
    this.submitForm = function (submit_button) {
      submit_button.submit(function (event) {
        // Serializing object to send
        // inclide event disabled fields
        $.fn.serializeIncludeDisabled = function () {
          var disabled = this.find(":input:disabled").removeAttr("disabled");
          var serialized = this.serialize();
          disabled.attr("disabled", "disabled");
          return serialized;
        };

        console.log($(this).serializeIncludeDisabled());

        // Call to animation function to aniamte the chart pie
        it.animateRefresh();
        event.preventDefault();
      });
    };

    // Reset button click event
    this.reset = function (reset_button) {
      reset_button.click(function () {
        it.init(choices, currencyLabel, dozeVAlInit, dir);
      });
    };

    // Pie chart Toggle click event
    this.showHideChart = function (toggle_pieChart) {
      toggle_pieChart.click(function(e) {
        $(el).find('#pie').toggleClass('open');
        e.preventDefault();
      });
    };

    // Animation Chart pie Function called when submitting form
    this.animateRefresh = function () {
      // Animate pie Chart while submitting
      d3.selectAll('.labels')
        .attr('class', 'labels rotating');
      d3.selectAll('.background')
        .attr('class', 'background rotating');
      d3.selectAll('.slices')
        .attr('class', 'slices rotating');

      // Disable buttons and draggers while submitting
      $('.range,.submit,.init,.print')
        .attr('disabled', true);

      d3.selectAll('.done')
        .attr('class', 'done animated fadeIn');


      setTimeout(function () {
        // Adding animation after a delay
        d3.selectAll('.labels.rotating')
          .attr('class', 'labels animated pulse infinite');
        d3.selectAll('.background.rotating')
          .attr('class', 'background animated pulse infinite');
        d3.selectAll('.slices.rotating')
          .attr('class', 'slices animated pulse infinite');
      }, 1000);

      setTimeout(function () {
        // After animation we refresh contents
        d3.selectAll('.labels.animated.pulse.infinite')
          .attr('class', 'labels');
        d3.selectAll('.background.animated.pulse.infinite')
          .attr('class', 'background');
        d3.selectAll('.slices.animated.pulse.infinite')
          .attr('class', 'slices');
        d3.selectAll('#pie')
          .attr('class', 'pie');

        $('.range,.submit,.init,.print')
          .removeAttr('disabled');

        it.init(choices, currencyLabel, dozeVAlInit, dir);
      }, 3000);
    };

    // Show Unlimited wan inside the pie chart
    this.showUnlimitedWarn = function (index) {
      var json = it.getData();
      d3.selectAll('.' + random + ' #pie .unlimitedImage')
        .attr('class', function (d, i) {
          if (json[i].unlimited === true) {
            return "animated flash unlimitedImage";
          }
          else {
            return 'unlimitedImage';
          }
        })
        .style("opacity", function (d, i) {
          if (json[i].unlimited === true) {
            return "1";
          }
          else {
            return "0.3";
          }
        });

      d3.selectAll('.' + random + ' #pie .unlimitedLabel')
        .attr('class', function (d, i) {
          if (json[i].unlimited === true) {
            return "animated flash unlimitedLabel";
          }
          else {
            return "unlimitedLabel";
          }
        })
        .style("opacity", function (d, i) {
          if (json[i].unlimited === true) {
            return "1";
          }
          else {
            return "0"
          }
        });
    };

    // Auto calculate Sum whiled ragging inputs
    this.calculateSum = function () {
      sum = 0;
      $(el).find('.percentFill').each(function (idx, item) {
        var number = $(item).find('span span').text(); // a string
        number.replace(/\D/g, ''); // a string of only digits, or the empty
        number = parseInt(number, 10); // now it's a numeric value
        sum += number
      });
      return sum;
    };

    // Binding range change variations
    this.bindRangeChanges = function (dataArray, that, idx, currency) {

      var val = $(that).val(),
        percentFill = $(that).siblings('.percentFill'),
        textFill = $(that).siblings('.percentFill').find('span'),
        dataMax = parseInt($(that).parent().data('max'), 10),
        dataMin = parseInt($(that).parent().data('min'), 10),
        unit = $(that).data('unit'),
        unitPriceCurrency = $(that).data('unit-price-currency'),
        dataLimit = parseFloat($(that).parent().data('limit'), 10),
        dataLimitValue = parseInt($(that).parent().data('limit-val'), 10),
        dataMinpercent = parseFloat($(that).parent().data('min-percent'), 10),
        max = dataMax > 0 ? dataMax : 1,
        calculate = ((val / max) * 100);

      for (var i = 0; i < dataArray.length; i++) {
        if (i === idx) {
          var _currency = 0,
            _unit_price = 0;

          // Set the unit price from the interval attribute unitPrice if the
          // array is not null or from un attribute unitPrice
          if (dataArray[i].interval !== null && dataArray[i].interval) {
            if (it.getCurrencyVal(val, dataArray[i]) === undefined) {
              _currency = 0;
            }
            else {
              _currency = it.getCurrencyVal(val, dataArray[i]);
            }
          }
          else {
            _currency = dataArray[i].unitPrice;
          }

          // check if input is disabled
          if ($(that).attr('disabled') === "disabled") {
            // Lock the percentFill width  to the min given value
            $(that).val(0);
            $(that).attr('value', 0);

            // Updating teh fill percent of the dragger
            percentFill.css('width', 0 + "%");

            _unit_price = 0;
            textFill.html(0 + " " + unit +
              " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
              "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
              unit + '</i>');

            it.showValues();
            it.updatePieChart();
            // Autocalculate SUM while dragging
            it.updateConsumption(it.calculateSum(), currency);
          }
          else {
            if (dataMinpercent > 0 && dataLimit === 0) {
              if ((parseInt(val, 10) / dataMax * 100) <= dataMinpercent) {

                _unit_price = Math.max(dataMin, parseInt(val, 10)) * _currency;

                $(that).val(parseInt(Math.max(dataMin, parseInt(val, 10)), 10));
                // Updating teh fill percent of the dragger
                percentFill.css('width', dataMinpercent + '%');

                textFill.html($(that).val() + " " + unit +
                  " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                  "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                  unit + '</i>');


                it.showValues();
                it.updatePieChart();
                // Autocalculate SUM while dragging
                it.updateConsumption(it.calculateSum(), currency);
                return;
              }
              else {
                $(that).val(parseInt(val, 10));
                _unit_price = parseInt(val, 10) * _currency;

                // Updating teh fill percent of the dragger
                percentFill.css('width', calculate + '%');

                textFill.html($(that).val() + " " + unit +
                  " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                  "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                  unit + '</i>');


                it.showValues();
                it.updatePieChart();
                // Autocalculate SUM while dragging
                it.updateConsumption(it.calculateSum(), currency);
                return;
              }
            }
            else if (dataMinpercent > 0 && dataLimit > 0 && dataMax > 0) {
              // Lock the percentFill width  to the min given value
              if ((parseInt(val, 10) / dataMax * 100) <= dataMinpercent) {

                _unit_price = Math.max(dataMin, parseInt(val, 10)) * _currency;

                $(that).val(parseInt(Math.max(dataMin, parseInt(val, 10)), 10));
                // Updating teh fill percent of the dragger
                percentFill.css('width', dataMinpercent + '%');

                textFill.html($(that).val() + " " + unit +
                  " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                  "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                  unit + '</i>');


                it.showValues();
                it.updatePieChart();
                // Autocalculate SUM while dragging
                it.updateConsumption(it.calculateSum(), currency);
                return;
              }
              else if ((parseInt(val, 10) / dataMax * 100) >= dataLimit) {
                _unit_price = Math.min(dataLimitValue, parseInt(val, 10)) * _currency;

                $(that).val(Math.min(dataLimitValue, parseInt(val, 10)));

                // Updating teh fill percent of the dragger
                percentFill.css('width', dataLimit + '%');

                textFill.html($(that).val() + " " + unit +
                  " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                  "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                  unit + '</i>');


                it.showValues();
                it.updatePieChart();
                // Autocalculate SUM while dragging
                it.updateConsumption(it.calculateSum(), currency);
                return;
              }
              else {
                $(that).val(parseInt(val, 10));
                _unit_price = parseInt(val, 10) * _currency;

                // Updating teh fill percent of the dragger
                percentFill.css('width', calculate + '%');

                textFill.html($(that).val() + " " + unit +
                  " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                  "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                  unit + '</i>');


                it.showValues();
                it.updatePieChart();
                // Autocalculate SUM while dragging
                it.updateConsumption(it.calculateSum(), currency);
                return;
              }
            }
            else if (dataLimit === 0 && parseInt(val, 10) >= 0) {
              // Lock the percentFill width  to the min given value
              $(that).val(parseInt(val, 10));
              $(that).attr('value', parseInt(val, 10));

              // Updating teh fill percent of the dragger
              percentFill.css('width', calculate + "%");
              _unit_price = parseInt(val, 10) * _currency;
              textFill.html(parseInt(val, 10) + " " + unit +
                " = <span>" + _unit_price.toFixed(2) + " " + unitPriceCurrency +
                "</span> <i> " + _currency + ' ' + unitPriceCurrency + " / " +
                unit + '</i>');

              it.showValues();
              it.updatePieChart();
              // Autocalculate SUM while dragging
              it.updateConsumption(it.calculateSum(), currency);
              return;
            }
          }

        }
      }
    };

    // Getting the current currency value
    this.getCurrencyVal = function (value, data) {
      if (data.interval.length > 1) {
        return data.interval.map(function (itm, idx) {
          if (value > itm.value) {
            return itm.unitPrice;
          }
        }).filter(function (item, idx) {
          return item !== undefined;
        }).slice(-1)[0];
      }
      else if (data.interval.length === 1) {
        return data.interval.map(function (itm, idx) {
          if (value < itm.value) {
            return data.unitPrice;
          }
          else if (value >= itm.value) {
            return itm.unitPrice;
          }
        }).filter(function (item, idx) {
          return item !== undefined;
        }).slice(-1)[0];
      }
      else {
        return data.unitPrice;
      }
    };

    // Update pie chart
    this.updatePieChart = function () {
      it.updateArcs();
      it.updateLabels();
      // it.updateLabelLines();
    };

    // Set edit box color to match slice color
    this.seteditboxcolor = function () {
      var mycolors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      d3.selectAll('.' + random + ' .edit')
        .data(mycolors)
        .attr('bgcolor', function (d) {
          return color(d);
        });


      // Adding a background color to each range slider
      d3.selectAll('.' + random + ' .percentFill').data(mycolors).each(function () {
        d3.select(this).style('background-color', function (d) {
          return color(d);
        });
      });


      // Adding a background color to each unlimited checkbox
      d3.selectAll('.' + random + ' .unlimited p').data(mycolors).each(function () {
        if ($(window).width() > 768) {
          d3.select(this)
            .style('color', function (d) {
              return color(d);
            });
        }
        else {
          d3.select(this)
            .style('color', function (d) {
              return "#fff";
            })
            .style('background-color', function (d) {
              return color(d);
            });
        }
      });

      d3.selectAll('.' + random + ' .unlimited label').data(mycolors).each(function () {
        d3.select(this)
          .style('color', function (d) {
            return color(d);
          });
      });

      // Set background-color for each span under the custom dragger
      d3.selectAll('.' + random + ' .dragger_controls').data(mycolors).each(function () {
        d3.select(this).select(".minus")
          .style('background-color', function (d) {
            return color(d);
          });
        d3.select(this).select(".plus")
          .style('background-color', function (d) {
            return color(d);
          });
      });
    };

    // Get JSON data from sliders
    this.getData = function () {
      var json = [];
      d3.selectAll('.' + random + ' #rangebox .range').each(function () {
        json.push({
          label: d3.select(this.parentNode.parentNode.parentNode)
            .select('.unlimited p')
            .text(),
          value: this.value ? this.value : 0,
          unit: d3.select(this).attr('data-unit'),
          unlimited: d3.select(this).attr('disabled') === "disabled"
        });
      });
      return json;
    };

    // Show slider value
    this.showValues = function () {
      d3.selectAll('.' + random + ' #rangebox .range:not(:disabled)').each(function () {
        var perct = this.value + d3.select(this).attr('data-unit');
        d3.select(this.parentNode.nextSibling).html(perct);
      });
    };

    // Draw pie chart
    this.pieChart = function (dataArray, currency, dozerValue) {
      var json = it.getData();

      d3.select('.' + random + ' #pie svg').remove();

      // svg canvas
      var svg = d3.select('.' + random + ' #pie')
        .append("svg:svg")
        .classed("svg-content", true)
        .attr('id', Math.random())
        .attr("viewBox", "0 0 " + (canvasWidth + 80) + " " + (canvasHeight + 80))
        .attr("preserveAspectRatio", "xMidYMid meet");

      var g = svg.append("svg:g")
        .attr("transform", "translate(" + (canvasWidth + 80) / 2 + "," + (canvasHeight ) / 2 + ")");

      var translate = "";
      if ($(window).width() <= 768) {
        translate = "translate(110px,20px)";
      }
      else {
        translate = "translate(100px,160px)";
      }

      // create svg elements under the transform
      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "unlimitedItems")
        .style("transform", translate);

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "background");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "slices");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "labels");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "lines");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "legend");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "number");

      d3.select('.' + random + ' g')
        .append("g")
        .attr("class", "done")
        .attr("transform", "translate(" + -125 + "," + -125 + ")");


      var unlimitedItems = svg.select('.' + random + ' .unlimitedItems').selectAll("path").data(pie(json));

      // Add unlimited pictos to the pie chart
      var yImgPos = 0;
      var widthImg = 0;

      if ($(window).width() <= 768) {
        yImgPos = 130;
        widthImg = 30;
      }
      else {
        yImgPos = 60;
        widthImg = 40;
      }

      unlimitedItems.enter()
        .append("svg:image")
        .attr('class', 'unlimitedImage')
        .attr("xlink:href", function (d, i) {
            return dataArray[i].picto;
          }
        )
        .attr("width", widthImg)
        .attr("height", widthImg)
        .attr("x", function (d, i) {
          if ($(window).width() <= 768) {
            return (35 * -i) + 20;
          }
          else {
            return (50 * -i) + 80;
          }
        })
        .attr("y", yImgPos)
        .style('opacity', 0.3);

      // Add label unlimited pictos on the pie
      unlimitedItems.enter()
        .append("svg:text")
        .attr('class', 'unlimitedLabel')
        .attr("fill", function (d, i) {
          return color(i);
        })
        .attr('text-anchor', 'start')
        .attr("x", function (d, i) {
          if ($(window).width() <= 768) {
            return (35 * -i) + 20;
          }
          else {
            return (50 * -i) + 82;
          }
        })
        .attr("y", yImgPos - 5)
        .style('opacity', 0)
        .html("illimité");


      // group all the paths into the slices class
      var arcpaths = svg.select('.' + random + ' .slices').selectAll("path").data(pie(it.getData()));

      arcpaths.enter()
        .append('svg:path')
        .attr("class", "slice")
        .attr("fill", function (d, i) {
          return color(i);
        })
        .attr("d", arc)
        .each(function (d) {
          this._current = d;
        })
        .append('title')
        .text(function (d, i) {
          return json[i].value + '%';
        });

      // add ok icon when submitting form
      var done = svg.select('.' + random + ' .done');

      // render done success pictos into the pie chart
      done.append("svg:image")
        .attr("xlink:href", function (d, i) {
            return "imgs/ok.png";
          }
        )
        .attr("width", 250)
        .attr("height", 250)

      // group all the paths into the labels class
      var arclabels = svg.select('.' + random + ' .labels').selectAll("image").data(pie(it.getData()));

      // render labels pictos into the pie chart
      arclabels.enter()
        .append("svg:image")
        .attr("class", "labelImage")
        .attr("transform", function (d) {
          var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x * x + y * y);
          return "translate(" + ( x - 10 ) + ',' +
            (y - 10) + ")";
        })
        .attr("xlink:href", function (d, i) {
            return dataArray[i].picto;
          }
        )
        .attr("text-anchor", "middle")
        .attr("width", 20)
        .attr("height", 20)
        .style('opacity', function (d, i) {
          if (dataArray[i].startValue === 0) {
            return 0;
          }
          else {
            return 1;
          }
        });

      // Changing color of the sum value if its less or greater thank dozerMax
      // value
      var _txt_color = "black";
      if (dozerValue > 0) {
        if (sum.toFixed(2) > dozerValue) {
          _txt_color = "red";
        }
        else if (sum.toFixed(2) === dozerValue) {
          _txt_color = "orange";
        }
        else {
          _txt_color = "green";
        }
      }

      svg.select('.' + random + ' .number')
        .append("svg:text")
        .attr('y', 0)
        .attr('fill', _txt_color)
        .attr("class", "sumValue")
        .attr("name", "price")
        .attr("text-anchor", "middle")
        .text(this.calculateSum().toFixed(2) + currency)
        .attr('width', 150)
        .attr('stroke-width', 150);

      // Adding current Total sum value to a hiden input in view to send it to
      // API while submit
      $(el).find('.sumvalueInput').val(it.calculateSum().toFixed(2) + currency);

      // String label to display inside the pie chart "total"
      svg.select('.' + random + ' .number')
        .append("svg:text")
        .attr('y', -35)
        .attr('fill', _txt_color)
        .attr("class", "totalString")
        .attr("text-anchor", "middle")
        .text('Total');


      // Append dozer value to the pie
      $(el).find('.amount').each(function (idx, item) {
        number = $(item).find('span span').text(); // a string
        number.replace(/\D/g, ''); // a string of only digits, or the empty
                                   // string
        number = parseInt(number, 10); // now it's a numeric value
        sum += number
      });

      // group all paths into the summary content
      svg.select('.' + random + ' .number')
        .append("svg:text")
        .attr('y', 30)
        .attr("class", "dozerSumValue")
        .attr('fill', "#868686")
        .attr("text-anchor", "middle");

      if (dozerValue > 0) {
        // Adding Sum value to a hidden input to send it while submitting form
        d3.select('.' + random + ' .dozerSumValue')
          .text(parseInt(dozerValue, 10).toFixed(2) + currency)
          .attr('width', 150)
          .attr('stroke-width', 150);
      }
      else {
        d3.select('.' + random + ' .dozerSumValue')
          .text("")
          .attr('width', 150)
          .attr('stroke-width', 150);
      }
      // Add the init gray background arc, from 0 to 100% .
      var background = svg.select('.' + random + ' .background').append("path")
        .datum({startAngle: 0, endAngle: 2 * pi})
        .style("fill", "#ddd")
        .attr("d", arc);
    };

    // Update the slices of the pie chart
    this.updateArcs = function () {
      var json = it.getData();
      d3.selectAll('.' + random + ' #pie .slices path title')
        .text(function (d, i) {
          if (json[i] !== undefined) {
            return json[i].value + json[i].unit;
          }
          else {
            return "";
          }
        });
      d3.selectAll('.' + random + ' #pie .slices path')
        .data(pie(json))
        .transition()
        .duration(300)
        .attrTween('d', this.arcTween);
    };

    // Updating text labels
    this.updateLabels = function () {

      //Append the label names on the outside
      d3.selectAll('.' + random + ' #pie .labelImage')
        .data(pie(it.getData()))
        .transition()
        .duration(120)
        .attr("transform", function (d) {
          var c = arc.centroid(d),
            x = c[0],
            y = c[1],
            // pythagorean theorem for hypotenuse
            h = Math.sqrt(x * x + y * y);
          return "translate(" + ( x - 10 ) + ',' +
            (y - 10) + ")";
        })
        .style('opacity', function (d, i) {
          if (it.getData()[i].value > 1) {
            return 1;
          }
          else {
            return 0;
          }
        });
    };

    // Drawing polylines
    this.updateLabelLines = function () {
      var outerArc = d3.svg.arc()
        .innerRadius(radius + 50)
        .outerRadius(radius * .95);

      var polyline = d3.select(".lines").selectAll("polyline")
        .data(pie(it.getData()));

      polyline.enter()
        .append("polyline")
        .attr('stroke-width', 3)
        .attr("stroke", function (d, i) {
          return color(i);
        });

      polyline.transition()
        .duration(100)

        .attrTween("points", function (d, i) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            if (it.getData()[i].startValue > 1) {
              return [arc.centroid(d2), outerArc.centroid(d2)];
            }
            else {
              return "";
            }
          };
        });

      polyline.exit()
        .remove();
    };

    // update the dozer max sumValue on the pie
    this.updateDozerConsumption = function (value, currency) {
      d3.selectAll('.' + random + ' #pie .dozerSumValue')
        .data(pie(it.getData()))
        .transition()
        .duration(120);
      if (value > 0) {
        d3.select('.' + random + ' .dozerSumValue').text(value + currency);
      }
      else {
        d3.select('.' + random + ' .dozerSumValue').text("");
      }
    };

    // Update the sumValue of the dragegd items
    this.updateConsumption = function (value, currency) {
      // Adding current Total sum value to a hiden input in view to send it to
      // API while submit
      $(el).find('.sumvalueInput').val(value);

      // the color changes depending to the total sum if its greater o less than
      // dozerValue
      var $amount = $(el).find('#amount').val();
      var val = value.toFixed(2);
      var color = "black",
        customClass = "";
      // if chart sum value is greater than the amount value, the Sum value
      // color is red
      if (parseFloat(val, 10) > parseFloat($amount, 10) && parseFloat($amount, 10) > 0) {
        color = "red";
        customClass = "sumValue animated bounceIn infinite superior";
      }
      // if chart sum value is equal than the amount value, the Sum value color
      // is orange
      else if (parseFloat(val, 10) === parseFloat($amount, 10) && parseFloat($amount, 10) > 0) {
        color = "orange";
        customClass = "sumValue animated bounceIn equal";
      }
      // if chart sum value is less than the amount value, the Sum value color
      // is green
      else if (parseFloat(val, 10) < parseFloat($amount, 10) && parseFloat($amount, 10) === 0) {
        customClass = "sumValue less";
        color = "green";
      }
      // if no amount value, the Sum value color is red
      else {
        color = "green";
        customClass = "sumValue";
      }

      d3.selectAll('.' + random + ' #pie .sumValue')
        .data(pie(it.getData()))
        .transition()
        .duration(120)
        .attr('class', customClass) // Adding a bouncing animation
        .attr('fill', color)
        .text(value.toFixed(2) + currency);
    };

    // Transition for the arcs
    this.arcTween = function (a) {
      var i = d3.interpolate(this._current, a);

      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    };
  };

  $.fn.rangeChart = function (options) {
    var opts = $.extend([], $.fn.rangeChart.defaults, options);

    return this.each(function () {
      var instance = new rangeChartClass($(this), opts);
      // Init chart
      instance.init(opts.choices, opts.currencyLabel, opts.dozeVAlInit, opts.dir);
    });
  };

  $.fn.rangeChart.defaults = {
    choices: [
      {
        label: "calls",
        min: null, // set value = 0 or null
        max: 100, // should be the maximmum value to show on drager, if we got
                  // intervals this shoud be the same as the highest interval
        interval: [{
          unitPrice: 5, // should be greater than 0, cuz if =0, the sum will
                        // equal to 0
          value: 0 // the value to display on each interval
        }, {
          unitPrice: 10,
          value: 50
        }, {
          unitPrice: 20,
          value: 100
        }], // set array of intervals  = { unitPrice : 5, value : 10
        // } or null
        startValue: 0, // init value, that should be a value in the interval
                       // values
        step: 1, // dragger step
        unit: 'H', // unit to show on intervals
        unitPrice: null, // if no interval, this attribute should be filled,
                         // else
        // =null
        unitPriceCurrency: null, // optional
        limit: null, // maximmum value to not exceed while dragging
        picto: './imgs/icon_phone.png'
      },
      {
        label: "data",
        min: null,
        max: 100,
        interval: [{
          unitPrice: 5,
          value: 0
        }, {
          unitPrice: 10,
          value: 50
        }, {
          unitPrice: 20,
          value: 100
        }],
        startValue: 0,
        step: 1,
        unit: 'Gb',
        unitPrice: null,
        unitPriceCurrency: null,
        limit: null,
        picto: './imgs/icon_data.png'
      },
      {
        label: "sms",
        min: null,
        max: 100,
        interval: [{
          unitPrice: 5,
          value: 0
        }, {
          unitPrice: 10,
          value: 50
        }, {
          unitPrice: 20,
          value: 100
        }],
        startValue: 0,
        step: 1,
        unit: 'U',
        unitPrice: null,
        unitPriceCurrency: null,
        limit: null,
        picto: './imgs/icon_sms.png'
      }
    ],
    currencyLabel: " $", //Currency balance label
    dozeVAlInit: null,
    dir: 'ltr',
    showPie: true,
    showUnlimited: true,
    showIcons: true
  };

})(jQuery);