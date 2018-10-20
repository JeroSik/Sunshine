const wind_a = tf.variable(tf.scalar(Math.random()));
const wind_b = tf.variable(tf.scalar(Math.random()));

const numIterations = 7.5;
const learningRate = 0.5; 
const optimizer = tf.train.sgd(learningRate);

function p_wind_feel(x) {
  return tf.tidy(() => {
    return wind_a.mul(x * -1).add(wind_b);
  });
}

function loss(prediction, labels) {
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

async function learnWindCoeff(x, y) {
  const predictionsBefore = p_wind_feel(x);
  await train(x, y, numIterations);
  const predictionsAfter = p_wind_feel(y);
}
