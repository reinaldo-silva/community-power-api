interface ICalculateEvaluation {
  evaluation: number;
  user: {
    varUser: string[];
    totalPosts: number;
    postsRange: number[];
  };
  post: {
    varPost: string[];
    likes: number;
    likesRange: number[];
  };
}

const calculateEvaluationPost = ({
  evaluation,
  user,
  post,
}: ICalculateEvaluation): number => {
  // Variaveis da postagem = 30%
  const sumVarPosts = post.varPost.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue ? 30 / post.varPost.length : 0);
  }, 0);

  // Variaveis do usuário = 15%
  const sumVarUser = user.varUser.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue ? 15 / user.varUser.length : 0);
  }, 0);

  //  Total de likes da postagem = 40%
  const sumTotalLikesPost = post.likesRange.reduce(
    (previousValue, currentValue) => {
      return (
        previousValue +
        (currentValue <= post.likes ? 40 / post.likesRange.length : 0)
      );
    },
    0,
  );

  console.log({ sumTotalLikesPost });

  // Total de posts do author = 15%
  const sumTotalPostUser = user.postsRange.reduce(
    (previousValue, currentValue) => {
      return (
        previousValue +
        (currentValue <= user.totalPosts ? 15 / user.postsRange.length : 0)
      );
    },
    0,
  );

  return [sumVarPosts, sumVarUser, sumTotalLikesPost, sumTotalPostUser].reduce(
    (previousValue, currentValue) => {
      return previousValue + currentValue;
    },
    0,
  );
};

export { calculateEvaluationPost };
