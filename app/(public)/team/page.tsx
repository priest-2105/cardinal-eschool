
import CoreValues from '@/components/public/pages/team/coreValues';
import JobOpenings from '@/components/public/pages/team/jobOpening';
import TeamSection from '@/components/public/pages/team/ourTeam';
import TeamOneSection from '@/components/public/pages/team/teamOneSection';

function Team() {
  return (
    <>
    <TeamOneSection/>
    <TeamSection/>
    <CoreValues/>
    <JobOpenings/>
    </>
  )
}

export default Team;