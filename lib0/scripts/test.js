function (c, a) {
    // Private script, used to test cccslib0.lib.

    let lib = #fs.cccslib0.lib()
    let futuretech = () => #fs.futuretech.public()
    return lib.repairCall(futuretech)
}