import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

interface SocialLinksProps {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
}

const SocialLinks = ({ instagram, twitter, linkedin, github, behance }: SocialLinksProps) => {
  return (
    <div className="flex justify-center gap-4 my-4">
      {instagram && (
        <a 
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={18} />
        </a>
      )}
      
      {twitter && (
        <a 
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Twitter"
        >
          <Twitter size={18} />
        </a>
      )}
      
      {linkedin && (
        <a 
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
      )}
      
      {github && (
        <a 
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
      )}
    </div>
  );
};

export default SocialLinks;
