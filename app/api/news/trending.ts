export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?country=tr&apiKey=${process.env.NEWS_API_KEY}`);
  const data = await apiRes.json();
  res.status(200).json(data);
}
