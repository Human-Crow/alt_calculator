document.getElementById("calc_but").addEventListener("click", function () {
    var resource_1 = parseFloat(document.getElementById("resource_1").value);
    var resource_2 = parseFloat(document.getElementById("resource_2").value);
    var result = resource_1 + resource_2;
    document.getElementById("result").textContent = "Result: " + result;
});