import { RenderOptions as IRtlRenderOptions, RenderResult as IRtlRenderResult } from "@testing-library/react"
import { History } from "history"
import React from "react"

import { IStore } from "#models/store"

interface IRenderResult extends IRtlRenderResult {
  history: History
  store: IStore
}

interface IRenderOptions extends Omit<IRtlRenderOptions, "wrapper"> {
  initialUrl?: string
}

export type IRender = (component: React.ReactElement, options?: IRenderOptions) => IRenderResult