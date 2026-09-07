import {BANK,deriveProgress,blocksForLevel} from './model';

export type LearningProgress=ReturnType<typeof deriveProgress>;

/** Route coverage counts attempted practice questions, never their correctness. */
export function levelOneRoute(progress:LearningProgress){
 const questionIds=blocksForLevel(1).flatMap(block=>block.questionIds);
 const answered=questionIds.filter(id=>progress.evidence[id]).length;
 const blocks=blocksForLevel(1).filter(block=>progress.complete.includes(block.id)).length;
 const milestones=blocks+Number(progress.successfulCheck)+Number(progress.paperDone);
 const total=questionIds.length+blocksForLevel(1).length+2;
 const completed=answered+milestones;
 const percent=progress.level1Passed?100:Math.min(99,Math.floor(completed/total*100));
 return {answered,blocks,milestones,completed,total,percent};
}
