import React from 'react'
import { Card, Label, Table, TextInput, Spinner } from 'flowbite-react'
import Button, { EButtonVariant } from '../Button'
import { useTimer } from '../../hooks/useTimer'

const CheckIcon = () => {
  return (
    <svg
      className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

const ProjectedItem = ({ lineItem }: any) => {
  return (
    <li className="flex items-center">
      <CheckIcon />
      <p className="text-gray-900 dark:text-gray-300 text-md">{lineItem}</p>
    </li>
  )
}

const ProjectedActions = ({
  projectedActions,
  simRunning,
  runReposition,
  simTimestamp,
  reset
}: any) => {
  const timeSinceSim = useTimer(simTimestamp)
  const simStale = timeSinceSim < 60 ? false : true
  const timeSinceSimTextColor = simStale ? 'text-red-500' : 'text-green-500'
  return (
    <div className="flex flex-col pt-10">
      <Card href="#">
        <div className="flex justify-between">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Projected actions
          </h5>
          <div className={timeSinceSimTextColor}>{timeSinceSim}s since sim</div>
        </div>
        {simRunning && (
          <div className="text-center">
            <Spinner size="xl" aria-label="Simulating..." />
          </div>
        )}
        {!simRunning && (
          <>
            <ul className="space-y-1 text-gray-500 list-inside dark:text-gray-400">
              {projectedActions.map((p: any, i: number) => {
                return <ProjectedItem lineItem={p} key={i} />
              })}
            </ul>
            <div className="flex flex-wrap">
              <div className="w-[62%] mr-[3%]">
                <Button className="w-[100%]" onClick={runReposition} disabled={simStale}>
                  {simStale ? 'Re-run stale simulation' : 'Reposition'}
                </Button>
              </div>
              <div className="w-[35%]">
                <Button
                  variant={EButtonVariant.secondary}
                  className={'w-[100%]'}
                  onClick={reset}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default ProjectedActions
