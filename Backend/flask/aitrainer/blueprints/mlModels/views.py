from flask import  render_template, request, jsonify, Response

from ..mlModels import mlModels

@mlModels.route('/deadlift')
def deadliftModelPage():
    time = request.args.get('time')
    userName = request.args.get('userName')

    return render_template('index.html',time=time, userName=userName, model='deadlift')

@mlModels.route('/push-up')
def pushUpModelPage():
    time = request.args.get('time')
    userName = request.args.get('userName')

    return render_template('index.html',time=time, userName=userName, model='push-up')
