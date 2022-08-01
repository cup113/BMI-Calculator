"use strict";
/// <reference path="../src/data.ts"/>
function err(text) {
    $("#info").text(text);
    var $result = $("#result");
    if (!$result.hasClass("none-display"))
        $result.addClass("none-display");
}
function calculate() {
    var weight = parseFloat($("#pers-info-weight").val()), height = parseFloat($("#pers-info-height").val()), gender = parseInt($("#pers-info-gender").val()), // 0女1男
    age = parseInt($("#pers-info-age").val()), bmi = weight * 10000 / height / height;
    if (isNaN(weight))
        err("请输入正数体重");
    else if (isNaN(height))
        err("请输入正数身高");
    else if (height < 1)
        err("身高不能小于1");
    else if (gender < 0 || gender > 1)
        err("请正确填写性别");
    else if (isNaN(age))
        err("请输入正数年龄");
    else if (age < 7)
        err("请输入大于等于7的年龄");
    else {
        var $result = $("#result"), dataStepMap = (gender === 0) ? dataStepFemale : dataStepFemale, dataStepKeys = Object.keys(dataStepMap), dataStepKey, dataStep = [], step, // 1偏瘦 2正常 3超重 4肥胖
        progressSurp; // 多余的进度(0-1)
        const steps = ["偏瘦", "正常", "超重", "肥胖"], ftcolors = ["#0000ff", "#00ff00", "#ff8800", "#ff0000"];
        for (let i of dataStepKeys) {
            dataStepKey = parseInt(i);
            if (dataStepKey <= age)
                dataStep = dataStepMap[dataStepKey];
            else
                break;
        }
        if (bmi < dataStep[0]) {
            step = 1;
            progressSurp = (bmi - dataStep[0] * 2 + dataStep[1]) / (dataStep[1] - dataStep[0]);
            if (progressSurp < 0)
                progressSurp = 0;
        }
        else if (bmi < dataStep[1]) {
            step = 2;
            progressSurp = (bmi - dataStep[0]) / (dataStep[1] - dataStep[0]);
        }
        else if (bmi < dataStep[2]) {
            step = 3;
            progressSurp = (bmi - dataStep[1]) / (dataStep[2] - dataStep[1]);
        }
        else {
            step = 4;
            progressSurp = (bmi - dataStep[1] * 2 + dataStep[2]) / (dataStep[2] - dataStep[1]);
            if (progressSurp > 1)
                progressSurp = 1;
        }
        if ($result.hasClass("none-display"))
            $result.removeClass("none-display");
        $("#res-progress-bar").css("--w", ((step - 1) / 4 + progressSurp / 4).toFixed(4));
        $("#res-thin-range").html("BMI&lt;" + dataStep[0].toFixed(1) + "<br>");
        $("#res-normal-range").html(dataStep[0].toFixed(1) + "&le;BMI&le;" + dataStep[1].toFixed(1) + "<br>");
        $("#res-overweight-range").html(dataStep[1].toFixed(1) + "&lt;BMI&le;" + dataStep[2].toFixed(1) + "<br>");
        $("#res-obesity-range").html("BMI&gt;" + dataStep[2].toFixed(1) + "<br>");
        $("#res-thin-wrange").html("&lt;" + (dataStep[0] * height * height / 10000).toFixed(1) + "kg");
        $("#res-normal-wrange").html((dataStep[0] * height * height / 10000).toFixed(1) + "kg~" + (dataStep[1] * height * height / 10000).toFixed(1) + "kg");
        $("#res-overweight-wrange").html((dataStep[1] * height * height / 10000).toFixed(1) + "kg~" + (dataStep[2] * height * height / 10000).toFixed(1) + "kg");
        $("#res-obesity-wrange").html("&ge;" + (dataStep[2] * height * height / 10000).toFixed(1) + "kg");
        $("#res-bmi").css("--color", ftcolors[step - 1]);
        $("#res-bmi-value").text(bmi.toFixed(2));
        $("#res-bmi-step").text(steps[step - 1]);
        $("#info").text("");
    }
}
