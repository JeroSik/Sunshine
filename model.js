const values = tf.placeholder(tf.float, [1,3]);
const coeff = tf.variable(tf.zeros[3,1]);
const bias = tf.variable(tf.scalar(Math.random()));

const numIterations = 75;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function predict(x) {
  return tf.tidy(() => {
    return tf.matmul(values, coeff);
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

async function learnCoefficients(data) {
  const before = predict(data.xs);
  await train(data.xs, data.ys, numIterations);
  
  const after =  predict(data.xs);
  
  before.dispose();
  after.dispose();
}
