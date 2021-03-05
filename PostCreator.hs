import Data.Time.Clock
import Data.Time.Calendar
import Data.List
import Text.Printf
import System.IO
data FrontMatter = FrontMatter {
    year :: Integer
    , month :: Int
    , day :: Int
    , title :: String
    , path :: String
    , description :: String
}

newtype AST = Head FrontMatter 



createNewPost :: String -> String -> String -> IO AST

createNewPost title path description = do 
    date <- getCurrentTime 
    let (year, month, day) = toGregorian $ utctDay date
    let frontMatter = FrontMatter {
        year=year 
        , month=month 
        , day=day 
        , title=title 
        , path=path 
        , description=description
        }
    return $ Head frontMatter

instance Show FrontMatter where
    show (FrontMatter year month day title path description) = 
        intercalate "\n" 
            [
            "---"
            , printf "title: %s" title
            , printf "path: %s" path
            , printf "description: %s" description
            , printf "date: %d-%d-%d" year month day 
            , "---" 
            ]

instance Show AST where
    show (Head head) = show head


main :: IO ()
main = do
    putStrLn "Enter title: "
    title <- getLine
    putStrLn "Enter path: "
    path <- getLine
    putStrLn "Enter description: "
    description <- getLine
    post <- createNewPost title path description
    handle <- openFile (printf "%s.md" path) WriteMode
    hPrint handle post
    hClose handle
    return ()