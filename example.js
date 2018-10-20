//import * as tf from '@tensorflow/tfjs';
//import {temp_data} from './data';
//import {plotData, plotDataAndPredictions, renderCoefficients} from './ui';

//temperature model regression constants
const temp_a = tf.variable(tf.scalar(Math.random()));
const temp_b = tf.variable(tf.scalar(Math.random()));

const numIterations = 75;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function p_temp_feel(x) {
  return tf.tidy(() => {
      return temp_a.mul(x).add(temp_b);
      });
}

function loss(predictions, labels) {
  const meanSquareError = predictions.sub(labels).square().mean();
  return meanSquareError;
}

async function train(xs, ys, numIterations) {
  for (let iter = 0; iter < numIterations; iter++) {
    optimizer.minimize(() => {
        const pred = p_temp_feel(xs);
        return loss(pred, ys);
        });
    await tf.nextFrame();
  }
}

function generateData(numPoints, coeff, sigma = 0.04) {
  return tf.tidy(() => {
      const [a, b] = [
      tf.scalar(coeff.a), tf.scalar(coeff.b)
      ];

      const xs = tf.randomUniform([numPoints], -1, 1);

      // Generate polynomial data
      const ys = a.mul(xs).add(b).add(Math.random()*10);

      // Normalize the y values to the range 0 to 1.
      //const ymin = ys.min();
      //const ymax = ys.max();
      //const yrange = ymax.sub(ymin);
      //const ysNormalized = ys.sub(ymin).div(yrange);

      return {
      xs, 
        ys//: ysNormalized
      };
  })
}

async function learnCoefficients() {
  const actual = {a: 0.2, b: -12};
  const trainingData = generateData(1000, actual);

  //await plotData('#data .plot', trainingData.xs, trainingData.ys)

  //renderCoefficients('#random .coeff', {
  //  a: a.dataSync()[0],
  //  b: b.dataSync()[0],
  //});

  const predictionsBefore = p_temp_feel(trainingData.xs);

  await train(trainingData.xs, trainingData.ys, numIterations);

  //renderCoefficients('#trained .coeff', {
  //  a: a.dataSync()[0],
  //  b: b.dataSync()[0],
  //});

  const predictionsAfter = p_temp_feel(trainingData.xs);

  predictionsBefore.dispose();
  predictionsAfter.dispose();

}

learnCoefficients();
