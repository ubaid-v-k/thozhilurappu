import { Plus } from "lucide-react";
import { Button } from "../ui/Button";

export default function CreatePostFloater() {
    return (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40">
            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 text-white transition-transform hover:scale-105"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    );
}
