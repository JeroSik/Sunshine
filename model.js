const coeff = tf.variable(tf.tensor([Math.random(), Math.random(), Math.random()], [1, 3]));
const bias = tf.variable(tf.scalar(Math.random()));

const numIterations = 75;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function predict(x) {
  return tf.tidy(() => {
    return coeff.matMul(x).add(bias);
  });
}

function loss(predictions, labels) {
  const meanSquareError = predictions.sub(labels).square().mean();
  return meanSquareError;
}

async function train(xs, ys, numIterations) {
  for (let i = 0; i < numIterations; i++) {
    optimizer.minimize(() => {
      const pred = predict(xs);
      return loss(pred, ys);
    });
    await tf.nextFrame();
  }
}

async function learnCoefficients(values, feels) {
  const before = predict(values);

  await train(values, feels, numIterations);

  const after = predict(values);
  
  before.dispose();
  after.dispose();
}

function main() {

  coeff.print();
  var values = [];
  var feels = [];
  for (let i = 0; i < 1000; i++) {
    values[i] = []; 
    values[i].push(dataset[i].temperature);
    values[i].push(dataset[i].humid);
    values[i].push(dataset[i].wind);
  
    feels[i] = dataset[i].feel;
  }

  for (let i = 0; i < 1000; i++) {
    learnCoefficients(tf.variable(tf.tensor(values[i], [3, 1])), feels[i]);
  }
  coeff.print();

}
main();
