import Head from "next/head"
import { FunctionComponent } from "react"

type Props = {
  description?: string
  title?: string
}

const CommonHead: FunctionComponent<Props> = ({ description, title }) => {
  const titleRoot = "GitHub Indicators Explorer"

  return (
    <Head>
      <title>{title ? `${title} | ${titleRoot}` : titleRoot}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

CommonHead.defaultProps = {
  description: "GitHub Indicators Explorer can help you get key metrics about your favourite github repositories.",
}

export default CommonHead
