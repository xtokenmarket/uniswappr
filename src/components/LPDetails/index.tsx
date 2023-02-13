import React, { useState } from 'react'
import { useSigner } from 'wagmi'
import ProjectedActions from './ProjectedActions'
import NewPriceRange from './NewPriceRange'
import PositionTable from './PositionTable'
import { reposition } from '../../utils/submit'

function LPDetails({ selectedPosition }: any) {
  const { data: signer } = useSigner()

  const [projectedActions, setProjectedActions] = useState([])
  const [simRunning, toggleSimRunning] = useState(false)
  const [repositionParams, setRepositionParams] = useState({})

  const { positionId, poolData } = selectedPosition

  const showProjectedActions = simRunning || projectedActions.length > 0

  const runReposition = async(e: any) => {
    e.preventDefault()
    // todo: run approval first, trigger second tx on confirmation
   
    console.log('repositioning')
    const tx = await reposition(signer, repositionParams)
    console.log('repositioned')
    // tx = await tx.wait()

    // todo: confirmed state
  }

  return (
    <div className="flex flex-col w-full h-full pt-10">
      <p className="text-xl font-extrabold">Position ID: {positionId}</p>
      <PositionTable selectedPosition={selectedPosition} />
      <NewPriceRange
        poolData={poolData}
        setProjectedActions={setProjectedActions}
        toggleSimRunning={toggleSimRunning}
        setRepositionParams={setRepositionParams}
      />
      {showProjectedActions && (
        <ProjectedActions
          projectedActions={projectedActions}
          simRunning={simRunning}
          runReposition={runReposition}
        />
      )}
    </div>
  )
}

export default LPDetails