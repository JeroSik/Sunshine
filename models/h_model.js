const humid_a = tf.variable(tf.scalar(Math.random()));
const humid_b = tf.variable(tf.scalar(Math.random()));

//const numIterations = 7.5;
//const learningRate = 0.0;
//const optimizer = tf.train.sgd(learningRate);

function p_humid_feel(x) {
  return tf.tidy(() => {
    return humid_a.mul(x).add(humid_b);
  });
}

//function loss(prediction, labels) {
//  const meanSquareError = prediction.sub(labels).square().mean();
//  return meanSquareError;
//}

//async function train(xs, ys, numIterations)  {
//  for (let i = 0; i < numIterations; i++) {
//    optimizer.minimize(() => {
//      const pred = p_humid_feel(xs);
//      return loss(pred, ys);
//    });
//    await tf.nextFrame();
//  }
//}

async function learnHumidCoeff(x, y) {
  const predictionsBefore = p_humid_feel(x);
  await train(x, y, numIterations);
  const predictionsAfter = p_humid_feel(y);
}

function h_init() {
  var humid = [];
  var feel = [];

  for (let i = 0; i < h_data.length; i++) {
    humid[i] = h_data[i].humididty;
    feel[i] = h_data[i].feel;
  }

  learnHumidCoeff(humid, feel);
  //humid_a.print();
  //humid_b.print();
}
