const temp_a = tf.variable(tf.scalar(Math.random()));
const temp_b = tf.variable(tf.scalar(Math.random()));

const numIterations = 7.5;
const learningRate = 0.0;
const optimizer = tf.train.sgd(learningRate);

function p_temp_feel(x) {
  return tf.tidy(() => {
    return temp_a.mul(x).add(temp_b);
  });
}

function loss(prediction, labels) {
  const meanSquareError = prediction.sub(labels).square().mean();
  return meanSquareError;
}

async function train(xs, ys, numIterations)  {
  for (let i = 0; i < numIterations; i++) {
    optimizer.minimize(() => {
      const pred = p_temp_feel(xs);
      return loss(pred, ys);
    });
    await tf.nextFrame();
  }
}

async function learnTempCoeff(x, y) {
  const predictionsBefore = p_temp_feel(x);
  await train(x, y, numIterations);
  const predictionsAfter = p_temp_feel(y);
}

function t_init() {
  var temp = [];
  var feel = [];

  for (let i = 0; i < t_data.length; i++) {
    temp[i] = t_data[i].temperature;
    feel[i] = t_data[i].feel;
  }
  
  learnTempCoeff(temp, feel);
  //temp_a.print();
  //temp_b.print();
}
