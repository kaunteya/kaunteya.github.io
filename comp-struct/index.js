const PFType = {
    flexi: 'flexi',
    fixed: 'fixed'
}
let sodexo = 27000;
let standDed = 52400;
let sec80C = 150000;
let homeInternet = 18000;
let newspaper = 24000;
let carSmall = 21600;
let carLarge = 28800;
let ltaMax = 150000;

function INR(num, zeroHypen = false) {
  if (zeroHypen == true && num == 0) { 
    return "-"
   }
  return new Intl.NumberFormat('en-IN').format(Math.round(num))
}

$(document).ready(function() {
    // Listens to base and variable pay and updates CTC
    $('#base').val(1000000);
    $('#var-pay').val(10);
    $('#base,#var-pay').on('input',function(e){
        let base = parseInt($('#base').val());
        let varPay = parseInt($('#var-pay').val());
        $('#totalCTC').text("Total CTC: " + totalCTC(base, varPay))
    });

    $('#calculate').click(calculate);
});

function totalCTC(base, varPay) {
    return base + ((varPay / 100) * base)
}

function taxSlabsForIncome(income) {
    var obj = {}

    if (income <= 250000) {
      obj[0.0] = income
      return obj
    } else {
      obj[0.0] = 250000
    }
    if (income <= 500000) {
      obj[5.2] = income - 250000
      return obj
    } else {
      obj[5.2] = 250000
    }
    if (income <= 1000000) {
      obj[20.8] = income - 500000
      return obj
    } else {
      obj[20.8] = 500000
    }
    if (income <= 5000000) {
      obj[31.2] = income - 1000000
      return obj
    } else {
      obj[31.2] = 4000000
    }
    if (income <= 10000000) {
      obj[34.2] = income - 5000000
      return obj
    } else {
      obj[34.2] = 5000000
    }
    if (income > 10000000) {
      obj[35.7] = income - 10000000
    }

    return obj
}

// Calculate total tax payable from obj returned from taxSlabsForIncome
function totalTaxPayable(taxSlabs) {
  return Object.keys(taxSlabs).reduce(function (previous, key) {
    return previous + ( (key / 100) * taxSlabs[key]);
  }, 0);
}

function getOptions() {
    let base = parseInt($('#base').val());
    let varPay = parseInt($('#var-pay').val());

    return {
        base : base,
        varPayPercent : varPay,
        totalCTC : totalCTC(base, varPay),
        isSodexo : $('#in-sodexo').is(":checked"),
        sodexoValue: $('#in-sodexo').is(":checked") ? sodexo : 0,
        isHomeInternet : $('#in-home-intr').is(":checked"),
        isLTA : $('#in-lta').is(":checked"),
        isNewspaper : $('#in-nwsppr').is(":checked"),
        isCarSmall : $('#in-car-sm').is(":checked"),
        isCarLarge : $('#in-car-lr').is(":checked"),
        pfType : $('#pfType option:selected').text(),
        npsPercent: parseInt($('#npsselet option:selected').text())
    }
}

function olderExemptions() {
    let options = getOptions();
    return {
        pf: options
    }
}

function values(basicPercent) {
    let options = getOptions();
    let basic = options.base * (basicPercent / 100);
    let hra = basic * 0.4;
    let pf = basic * 0.12;
    let variablePay = options.totalCTC - options.base;
    let olderTotalExemption = pf + sodexo + hra + standDed + sec80C;
    let taxableIncome = options.base - olderTotalExemption;
    let taxSlabs = taxSlabsForIncome(taxableIncome);
    let taxPayable = Math.round(totalTaxPayable(taxSlabs))
    let nps = basic * (options.npsPercent / 100)
    return {
        options: options,
        basic: basic,
        hra: hra,
        pf: pf,
        variablePay: variablePay,
        olderTotalExemption: olderTotalExemption,
        taxableIncome: taxableIncome,
        taxPayable: taxPayable,
        nps: nps
    }
}

function calculate() {
    let v30 = values(30)
    let v40 = values(40)
    let v50 = values(50)
  console.log(v30);
    let trbasic = '#calculated-table tr.basic'
    $(`${trbasic} td.b3a`).text(INR(v30.basic));
    $(`${trbasic} td.b3m`).text(INR(v30.basic / 12));
    $(`${trbasic} td.b4a`).text(INR(v40.basic));
    $(`${trbasic} td.b4m`).text(INR(v40.basic / 12));
    $(`${trbasic} td.b5a`).text(INR(v50.basic));
    $(`${trbasic} td.b5m`).text(INR(v50.basic / 12));

    let trhra = '#calculated-table tr.hra'
    $(`${trhra} td.b3a`).text(INR(v30.hra));
    $(`${trhra} td.b3m`).text(INR(v30.hra / 12));
    $(`${trhra} td.b4a`).text(INR(v40.hra));
    $(`${trhra} td.b4m`).text(INR(v40.hra / 12));
    $(`${trhra} td.b5a`).text(INR(v50.hra));
    $(`${trhra} td.b5m`).text(INR(v50.hra / 12));

    let trpf = '#calculated-table tr.pf-emp'
    $(`${trpf} td.b3a`).text(INR(v30.pf));
    $(`${trpf} td.b3m`).text(INR(v30.pf / 12));
    $(`${trpf} td.b4a`).text(INR(v40.pf));
    $(`${trpf} td.b4m`).text(INR(v40.pf / 12));
    $(`${trpf} td.b5a`).text(INR(v50.pf));
    $(`${trpf} td.b5m`).text(INR(v50.pf / 12));

    let trflexi = '#calculated-table tr.flexi-pay'
    $(`${trflexi} td.b3a`).text(INR((v30.options.base - v30.basic - v30.hra - v30.pf)));
    $(`${trflexi} td.b3m`).text(INR((v30.options.base - v30.basic - v30.hra - v30.pf) / 12));
    $(`${trflexi} td.b4a`).text(INR((v40.options.base - v40.basic - v40.hra - v40.pf)));
    $(`${trflexi} td.b4m`).text(INR((v40.options.base - v40.basic - v40.hra - v40.pf) / 12));
    $(`${trflexi} td.b5a`).text(INR((v50.options.base - v50.basic - v50.hra - v50.pf)));
    $(`${trflexi} td.b5m`).text(INR((v50.options.base - v50.basic - v50.hra - v50.pf) / 12));

    let trbase = '#calculated-table tr.base-pay'
    $(`${trbase} td.b3a`).text(INR(v30.options.base));
    $(`${trbase} td.b3m`).text(INR(v30.options.base / 12));
    $(`${trbase} td.b4a`).text(INR(v40.options.base));
    $(`${trbase} td.b4m`).text(INR(v40.options.base / 12));
    $(`${trbase} td.b5a`).text(INR(v50.options.base));
    $(`${trbase} td.b5m`).text(INR(v50.options.base / 12));

    let trvarpay = '#calculated-table tr.var-pay'
    $(`${trvarpay} td.b3a`).text(INR(v30.variablePay));
    $(`${trvarpay} td.b3m`).text(INR(v30.variablePay / 12));
    $(`${trvarpay} td.b4a`).text(INR(v40.variablePay));
    $(`${trvarpay} td.b4m`).text(INR(v40.variablePay / 12));
    $(`${trvarpay} td.b5a`).text(INR(v50.variablePay));
    $(`${trvarpay} td.b5m`).text(INR(v50.variablePay / 12));

    let trctc = '#calculated-table tr.ctc'
    $(`${trctc} td.b3a`).text(INR(v30.options.totalCTC));
    $(`${trctc} td.b3m`).text(INR(v30.options.totalCTC / 12));
    $(`${trctc} td.b4a`).text(INR(v40.options.totalCTC));
    $(`${trctc} td.b4m`).text(INR(v40.options.totalCTC / 12));
    $(`${trctc} td.b5a`).text(INR(v50.options.totalCTC));
    $(`${trctc} td.b5m`).text(INR(v50.options.totalCTC / 12));

    

    let trtaxInc = '#calculated-table tr.tax-inc'
    $(`${trtaxInc} td.b3a`).text(INR(v30.taxableIncome));
    $(`${trtaxInc} td.b3m`).text(INR(v30.taxableIncome / 12));
    $(`${trtaxInc} td.b4a`).text(INR(v40.taxableIncome));
    $(`${trtaxInc} td.b4m`).text(INR(v40.taxableIncome / 12));
    $(`${trtaxInc} td.b5a`).text(INR(v50.taxableIncome));
    $(`${trtaxInc} td.b5m`).text(INR(v50.taxableIncome / 12));

    // Exemptions
    
    let trexPF = '#calculated-table tr.ex-pf-emp'
    $(`${trexPF} td.b3a`).text(INR(v30.pf));
    $(`${trexPF} td.b3m`).text(INR(v30.pf / 12));
    $(`${trexPF} td.b4a`).text(INR(v40.pf));
    $(`${trexPF} td.b4m`).text(INR(v40.pf / 12));
    $(`${trexPF} td.b5a`).text(INR(v50.pf));
    $(`${trexPF} td.b5m`).text(INR(v50.pf / 12));

    let trSodexo = '#calculated-table tr.sodexo'
    $(`${trSodexo} td.b3a`).text(INR(v30.options.sodexoValue, true));
    $(`${trSodexo} td.b3m`).text(INR(v30.options.sodexoValue / 12, true));
    $(`${trSodexo} td.b4a`).text(INR(v40.options.sodexoValue, true));
    $(`${trSodexo} td.b4m`).text(INR(v40.options.sodexoValue / 12, true));
    $(`${trSodexo} td.b5a`).text(INR(v50.options.sodexoValue, true));
    $(`${trSodexo} td.b5m`).text(INR(v50.options.sodexoValue / 12, true));

  
    let trexhra = '#calculated-table tr.ex-hra'
    $(`${trexhra} td.b3a`).text(INR(v30.hra));
    $(`${trexhra} td.b3m`).text(INR(v30.hra / 12));
    $(`${trexhra} td.b4a`).text(INR(v40.hra));
    $(`${trexhra} td.b4m`).text(INR(v40.hra / 12));
    $(`${trexhra} td.b5a`).text(INR(v50.hra));
    $(`${trexhra} td.b5m`).text(INR(v50.hra / 12));

    let tr80c = '#calculated-table tr.ded-80c'
    $(`${tr80c} td.b3a`).text(INR(sec80C));
    $(`${tr80c} td.b3m`).text(INR(sec80C / 12));
    $(`${tr80c} td.b4a`).text(INR(sec80C));
    $(`${tr80c} td.b4m`).text(INR(sec80C / 12));
    $(`${tr80c} td.b5a`).text(INR(sec80C));
    $(`${tr80c} td.b5m`).text(INR(sec80C / 12));

    
    let trstandDed = '#calculated-table tr.stand-ded'
    $(`${trstandDed} td.b3a`).text(INR(standDed));
    $(`${trstandDed} td.b3m`).text(INR(standDed / 12));
    $(`${trstandDed} td.b4a`).text(INR(standDed));
    $(`${trstandDed} td.b4m`).text(INR(standDed / 12));
    $(`${trstandDed} td.b5a`).text(INR(standDed));
    $(`${trstandDed} td.b5m`).text(INR(standDed / 12));

    
    let trhmIntr = '#calculated-table tr.home-inter'
    $(`${trhmIntr} td.b3a`).text(INR(homeInternet));
    $(`${trhmIntr} td.b3m`).text(INR(homeInternet / 12));
    $(`${trhmIntr} td.b4a`).text(INR(homeInternet));
    $(`${trhmIntr} td.b4m`).text(INR(homeInternet / 12));
    $(`${trhmIntr} td.b5a`).text(INR(homeInternet));
    $(`${trhmIntr} td.b5m`).text(INR(homeInternet / 12));

    
    let trnewspaper = '#calculated-table tr.newsppr'
    $(`${trnewspaper} td.b3a`).text(INR(newspaper));
    $(`${trnewspaper} td.b3m`).text(INR(newspaper / 12));
    $(`${trnewspaper} td.b4a`).text(INR(newspaper));
    $(`${trnewspaper} td.b4m`).text(INR(newspaper / 12));
    $(`${trnewspaper} td.b5a`).text(INR(newspaper));
    $(`${trnewspaper} td.b5m`).text(INR(newspaper / 12));

    
    let trcarlg = '#calculated-table tr.carlg'
    $(`${trcarlg} td.b3a`).text(INR(carLarge));
    $(`${trcarlg} td.b3m`).text(INR(carLarge / 12));
    $(`${trcarlg} td.b4a`).text(INR(carLarge));
    $(`${trcarlg} td.b4m`).text(INR(carLarge / 12));
    $(`${trcarlg} td.b5a`).text(INR(carLarge));
    $(`${trcarlg} td.b5m`).text(INR(carLarge / 12));

    let trnps = '#calculated-table tr.nps'
    $(`${trnps} td.b3a`).text(INR(v30.nps));
    $(`${trnps} td.b3m`).text(INR(v30.nps / 12));
    $(`${trnps} td.b4a`).text(INR(v40.nps));
    $(`${trnps} td.b4m`).text(INR(v40.nps / 12));
    $(`${trnps} td.b5a`).text(INR(v50.nps));
    $(`${trnps} td.b5m`).text(INR(v50.nps / 12));

    let trothex = '#calculated-table tr.other-exem'
    $(`${trothex} td.b3a`).text("-");
    $(`${trothex} td.b3m`).text("-");
    $(`${trothex} td.b4a`).text("-");
    $(`${trothex} td.b4m`).text("-");
    $(`${trothex} td.b5a`).text("-");
    $(`${trothex} td.b5m`).text("-");

    
    let trtotex = '#calculated-table tr.totl-exmp'
    $(`${trtotex} td.b3a`).text(INR((v30.pf + sodexo + v30.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v30.nps)));
    $(`${trtotex} td.b3m`).text(INR((v30.pf + sodexo + v30.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v30.nps) / 12));
    $(`${trtotex} td.b4a`).text(INR((v40.pf + sodexo + v40.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v40.nps)));
    $(`${trtotex} td.b4m`).text(INR((v40.pf + sodexo + v40.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v40.nps) / 12));
    $(`${trtotex} td.b5a`).text(INR((v50.pf + sodexo + v50.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v50.nps)));
    $(`${trtotex} td.b5m`).text(INR((v50.pf + sodexo + v50.hra + sec80C + standDed + homeInternet + newspaper + carLarge + v50.nps) / 12));

  }
