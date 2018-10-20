import * as tf from '@tensorflow/tfjs';
import {temp_data} from './data';
import {plotData, plotDataAndPredictions, renderCoefficients} from './ui';

//temperature model regression constants
const temp_a = tf.variable(tf.scalar(Math.random()));
const temp_b = tf.variable(tf.scalar(Math.random()));

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);
const optimizer = tf.train.sgd(learningRate);

function p_temp_feel(x) {
  return tf.tidy(() => {
    return temp_a.mul(x).add(temp_b);
  }
}

function loss(predictions, labels) {
  const meanSquareError = predictions.sub(labels).square().mean();
  return meanSqareError;
}

function train(xs, ys, numIterations) {
  for (let iter = 0; iter < numIterations; iter++) {
    optimizer.minimize(() => {
      const pred = predict(xs);
      return loss(pred, ys);
    });
    await tf.nextFrame();
  }
}

async function learnCoefficients() {
  const actual = {a: 0.2, b: -12};
  const trainingData = generateData(100, trueCoefficients);

  renderCoefficients('#data .coeff', actual);
  await plotData('#data .plot', trainingData.xs, trainingData.ys)

  renderCoefficients('#random .coeff', {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
  });

  const predictionsBefore = predict(trainingData.xs);
