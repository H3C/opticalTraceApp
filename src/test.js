const arr1 = [{a:1},{a:2},{a:3},{a:4},{a:5},{a:6},{a:7},{a:8},{a:9},{a:10},{a:11}];

function block(data) {
    var arr = data.slice(0,3);
    var ids = [];
    return new Promise((r, j) => {
        if (arr && arr.length) {
            Promise.all(arr.map(item => new Promise((r1, j1) => {
                if (item.a % 3) {
                    ids.push(item.a);
                    r1('ok')
                } else {
                    r1('ok')
                }
            })))
                .then((res) => {
                    if (data.length >= 3) {
                        block(data.slice(3))
                            .then(res => r([...ids, ...res]))
                    } else { r(ids) }
                })

        } else {
            r(ids)
        }
    })
}
Promise.resolve()
    .then(() => block(arr1, []))
    .then(ids => console.log('******', ids))